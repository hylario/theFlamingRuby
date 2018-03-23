var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Monster = require('./monster');

var PlayerMonsterSchema = new Schema({
	player: { type: Schema.Types.ObjectId, ref: 'Player' },
	monster: { type: Schema.Types.ObjectId, ref: 'Monster' },
	name: { type: String },
	level: { type: Number },
	hp: { type: Number },
	hpMax: { type: Number },
	attack: { type: Number, default: 0 },
	defense: { type: Number, default: 0 },
	experience: { type: Number },
	gold: { type: Number, default: 0},
	loot: [{
		rarity: Number, 
		item: { type: Schema.Types.ObjectId, ref: 'Item' }
	}],
	dead: { type: Boolean, default: false },
	created: { type: Date, default: new Date() },
	killed: { type: Date }
});

PlayerMonsterSchema.methods.resetHp = function () {

	let playerMonster = this;
	this.set({ hp: this.hpMax });
	this.save(function(err, updated){
		if(err) throw err;

		mongoose.socketClient.emit('monsterInfo', playerMonster);
	});
};

PlayerMonsterSchema.methods.setDead = function () {

	let self = this;
	this.set({
		dead: true,
		killed: new Date()
	});
	this.save(function(err, updated){
		if(err) throw err;

		Monster.findOne({_id: updated.monster}, function(err, monster){
			if(err) throw err;

			if(monster){

				let playerMonster = self;

				playerMonster.isNew = true;
				playerMonster._id = mongoose.Types.ObjectId();
				playerMonster.name = monster.name;
				playerMonster.level = monster.level;
				playerMonster.hp = monster.hp;
				playerMonster.hpMax = monster.hp;
				playerMonster.attack = monster.attack;
				playerMonster.defense = monster.defense;
				playerMonster.experience = monster.experience;
				playerMonster.gold = monster.gold;
				playerMonster.loot = monster.loot;

				playerMonster.save(function(err){
					if(err) throw err;

					mongoose.socketClient.emit('monsterInfo', playerMonster);
				});
			}
		});
	});
};

PlayerMonsterSchema.methods.addHp = function (attack) {

	let playerMonster = this;
	this.set({ hp: (this.hp + attack).toFixed(2) });
	this.save(function(err, updated){
		if(err) throw err;

		if(playerMonster.hp > 0)
			mongoose.socketClient.emit('monsterInfo', playerMonster);
	});
};

module.exports = mongoose.model('PlayerMonster', PlayerMonsterSchema);