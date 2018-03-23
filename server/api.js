var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var base64 = require('node-base64-image');

var Monster = require('./models/monster');
var Item = require('./models/item');
var User = require('./models/user');
var Player = require('./models/player');
var Experience = require('./models/experience');
var PlayerItem = require('./models/player_item');
var PlayerMonster = require('./models/player_monster');

let api = {};

String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

api.attack = function(monster_id){

	let client = this;

	async.seq(
		// Find Player
		function(callback){

			Player.findOne({_id: client.decoded_token.player._id}, function(err, player){
				if(err) callback(err);

				if(player){
					if(player.cooldown <= new Date()){
						callback(null, player);
					}else{
						api.update(client);
						callback(true);
					}
				}
			});
		},
		// Find Experience
		function(player, callback){

			Experience.findOne({level: player.level}, function(err, exp){
				if(err) callback(err);

				if(exp){
					callback(null, {player, exp});
				}else{
					callback(true);
				}
			});
		},
		// Find Monster
		function(data, callback){

			let {player, exp} = data;

			PlayerMonster.findOne({_id: monster_id}, function(err, monster){
				if(err) callback(err);

				if(monster){

					player.exp = exp;

					player.attackMonster(monster, function(result){

						console.log(result);

						callback(null, true);
					});

				}
			});
		}
	)(function(err, result){

		api.update(client);
	});
};

api.update = (client) => {

	if(typeof client.decoded_token !== 'undefined' && typeof client.decoded_token.player !== 'undefined'){

		async.seq(
			function(callback){
				Player.findOne({_id: client.decoded_token.player._id}).populate('user').exec(function(err, player){
					if(err) callback(err);

					if(player){
						callback(null, player);
					}
				});
			},
			function(player, callback){

				Experience.findOne({level: player.level}, function(err, exp){
					if(err) callback(err);

					if(exp){
						let cooldown = player.cooldown - new Date();
						let stats = {
							health: {value: player.health, cap: player.healthCap},
							attack: {value: player.attack, cap: player.attackCap},
							defense: {value: player.defense, cap: player.defenseCap},
							accuracy: {value: player.accuracy, cap: player.accuracyCap},
							evasion: {value: player.evasion, cap: player.evasionCap}
						};
						callback(null, {
							stats,
							name: player.user.username,
							level: player.level,
							gold: player.gold,
							hp: player.hp,
							hpMax: player.health * 10,
							total_experience: player.experience,
							experience: player.experience - exp.experience,
							experience_to_next_level: exp.experience_to_next_level,
							cooldown: cooldown < 0 ? 0 : cooldown,
							cooldownSeconds: player.cooldownSeconds
						})
					}
				});
			}
		)(function(err, result){
			if(err) return;

			client.emit('update', result);
		});
	}
};

api.battleLog = function(client, battleLog){

	client.emit('battleLog', battleLog);
};

api.getInventory = function(type){

	let client = this;
	let itemType = type || 'weapon';

	PlayerItem.find({itemType}, function(err, items){

		client.emit('inventoryItems', items);
	});
};

api.getMonsterInfo = function(monster_id, client){

	if(!client)
		client = this;

	client.monster_id = monster_id;

	PlayerMonster.findOne({monster: monster_id, dead: 0}, {}, {sort: {created: -1}}, function(err, playerMonster){
		if(err) throw err;

		if(playerMonster){

			client.emit('monsterInfo', playerMonster);
			api.battleLog(client, {monster: playerMonster});
		}else{

			Monster.findOne({_id: monster_id}, function(err, monster){
				if(err) throw err;

				if(monster){

					let playerMonster = new PlayerMonster(monster);

					playerMonster.player = client.decoded_token.player._id;
					playerMonster.monster = monster._id;
					playerMonster.hpMax = monster.hp;
					playerMonster._id = mongoose.Types.ObjectId();
					playerMonster.isNew = true;

					playerMonster.save(function(err){
						if(err) throw err;

						client.emit('monsterInfo', playerMonster);
						api.battleLog(client, playerMonster);
					});
				}
			});
		}
	});
};

module.exports = api;