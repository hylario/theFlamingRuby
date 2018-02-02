var fs = require('fs');
var async = require('async');

var Monster = require('./models/monster');
var Item = require('./models/item');
var User = require('./models/user');
var Player = require('./models/player');
var Experience = require('./models/experience');

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

			Monster.findOne({_id: monster_id}, function(err, monster){
				if(err) callback(err);

				if(monster){

					let battleLog = player.attackMonster(monster);

					let newCooldown = new Date();
					let cooldownSeconds = 0.1;
					let experience = player.experience;// + battleLog.experience;
					let gold = player.gold + battleLog.gold;

					if(experience < 0){
						experience = 0;
						cooldownSeconds = 0;
					}

					if(experience >= exp.experience + exp.experience_to_next_level){
						player.level += 1;
					}else if(experience < exp.experience){
						player.level -= 1;
					}

					newCooldown.setMilliseconds(newCooldown.getMilliseconds() + (cooldownSeconds * 1000));

					api.battleLog(client, battleLog);

					player.cooldown = newCooldown;
					player.cooldownSeconds = cooldownSeconds;
					player.experience = experience;
					player.gold = gold;

					Player.update({ _id: player._id }, player, null, function(err){
						if(err) callback(err);

						callback(null, true);
					});
				}
			});
		}
	)(function(err, result){

		api.update(client);
	});
};

api.update = function(client){

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

module.exports = api;