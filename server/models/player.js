var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var PlayerMonster = require('./player_monster');

var PlayerSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	level: { type: Number, default: 1 },
	experience: { type: Number, default: 0 },
	cooldown: { type: Date, default: new Date() },
	cooldownSeconds: { type: Number, default: 0 },
	credits: { type: Number, default: 0 },
	gold: { type: Number, default: 0 },
	ruby: { type: Number, default: 0 },
	hp: { type: Number, default: 10 },
	health: { type: Number, default: 1 },
	attack: { type: Number, default: 1 },
	defense: { type: Number, default: 1 },
	accuracy: { type: Number, default: 50 },
	evasion: { type: Number, default: 0 },
	healthCap: { type: Number, default: 500 },
	attackCap: { type: Number, default: 500 },
	defenseCap: { type: Number, default: 500 },
	accuracyCap: { type: Number, default: 55 },
	evasionCap: { type: Number, default: 5 }
});

PlayerSchema.methods.attackMonster = function (monster, callback) {
	
	let minAttack = (0.085 * ((this.accuracy - 25) / 100) * (1 * 2) * this.attack) + (this.level / 5) - (monster.defense * 2);
	let maxAttack = (0.085 * (this.accuracy / 100) * (1 * 2.5) * this.attack) + (this.level / 5) - (monster.defense * 2);

	let playerMinDef = (this.defense * 0.02 * 6);
	let playerMaxDef = (this.defense * 0.0956 * 6);

	let playerTotalHitCount = 0;
	let monsterTotalHitCount = 0;
	let playerHitCount = 0;
	let playerMissedCount = 0;
	let monsterHitCount = 0;
	let monsterMissedCount = 0;

	let totalDamage = 0;
	let totalDamageTaken = 0;

	let averageDamage = 0;
	let averageDamageTaken = 0;

	let gold = 0;
	let experience = 0;

	let win = false;

	if(this.hp > 0 && monster.hp > 0){

		let attack = Number(((Math.random() * (maxAttack - minAttack)) + minAttack).toFixed(2));

		if(Math.random() > (this.accuracy / 100)){
			attack = 0;
		}

		if(attack <= 0){
			attack = 0;
			playerMissedCount++;
		}else{
			playerHitCount++;
		}

		monster.addHp(-attack);

		totalDamage += attack;
		playerTotalHitCount++;

		if(monster.hp <= 0){

			win = true;
			monster.setDead();
		}else{

			let playerDef = ((Math.random() * (playerMaxDef - playerMinDef)) + playerMinDef).toFixed(2);
			let monsterAttack = monster.attack - playerDef;

			if(Math.random() <= (this.evasion / 100) || monsterAttack < 0){
				monsterAttack = 0;
				monsterMissedCount++;
			}

			if(monsterAttack > 0){
				monsterHitCount++;
			}

			this.hp = (this.hp - monsterAttack).toFixed(2);
			totalDamageTaken += monsterAttack;

			monsterTotalHitCount++;

			if(this.hp <= 0){
				win = false;
				this.resetHp();
				this.experience = (this.experience * 0.97).toFixed(2);

				monster.resetHp();
			}
		}
	}else{

		if(this.hp <= 0){
			this.resetHp();
		}

		if(monster.hp <= 0){
			monster.resetHp();
		}
	}

	if(win){

		gold = Math.round(Math.random() * monster.gold);
		experience = monster.experience;

		this.getLootStats();
	}

	totalDamage = totalDamage.toFixed(2);
	totalDamageTaken = totalDamageTaken.toFixed(2);

	averageDamage = (totalDamage > 0 && playerHitCount > 0 ? (totalDamage / playerHitCount).toFixed(2) : 0);
	averageDamageTaken = (totalDamageTaken > 0 && monsterHitCount > 0 ? (totalDamageTaken / monsterHitCount).toFixed(2) : 0);

	this.experience += experience;
	this.gold += gold;

	let newCooldown = new Date();
	let cooldownSeconds = 0.1;

	if(this.experience < 0){
		this.experience = 0;
		cooldownSeconds = 0;
	}

	if(this.experience >= this.exp.experience + this.exp.experience_to_next_level){
		this.level += 1;
	}else if(experience < this.exp.experience){
		this.level -= 1;
	}

	newCooldown.setMilliseconds(newCooldown.getMilliseconds() + (cooldownSeconds * 1000));

	this.cooldown = newCooldown;
	this.cooldownSeconds = cooldownSeconds;

	this.save(function(err){
		if(err) throw err;

		callback({
			playerTotalHitCount,
			monsterTotalHitCount,
			playerHitCount,
			playerMissedCount,
			monsterHitCount,
			monsterMissedCount,
			totalDamage,
			totalDamageTaken,
			win,
			gold,
			experience,
			averageDamage,
			averageDamageTaken,
			monster,
			monsterName: monster.name,
			playerWeapon: null
		});
	});
};

PlayerSchema.methods.resetHp = function () {
	this.set({ hp: this.health * 10 });
	this.save(function(err, updated){
		if(err) throw err;
		console.log("\x1b[32m" + updated + "\x1b[37m");
	});
};

PlayerSchema.methods.getLootStats = function () {

	// 1 = Health
	// 2 = Attack
	// 3 = Defense
	// 4 = Accuracy
	// 5 = Evasion

	let stat = Math.floor(Math.random() * 10) + 1;
	console.log(stat);
	let rand = Math.random();

	switch(stat){
		case 1: 
			if(this.health < this.healthCap && rand >= this.health / 5000)
				this.health += 1;
			break;
		case 2: 
			if(this.attack < this.attackCap && rand >= this.attack / 5000)
				this.attack += 1;
			break;
		case 3: 
			if(this.defense < this.defenseCap && rand >= this.defense / 5000)
				this.defense += 1;
			break;
		case 4: 
			if(this.accuracy < this.accuracyCap && rand >= (this.accuracy - 50) / 50)
				this.accuracy = (this.accuracy + 0.01).toFixed(2);
			break;
		case 5: 
			if(this.evasion < this.evasionCap && rand >= this.evasion / 50)
				this.evasion = (this.evasion + 0.01).toFixed(2);
			break;
		default:
			return;
	}
};

module.exports = mongoose.model('Player', PlayerSchema);