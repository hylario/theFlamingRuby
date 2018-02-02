var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var PlayerSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	level: { type: Number, default: 1 },
	experience: { type: Number, default: 0 },
	cooldown: { type: Date, default: new Date() },
	cooldownSeconds: { type: Number, default: 0 },
	credits: { type: Number, default: 0 },
	gold: { type: Number, default: 0 },
	ruby: { type: Number, default: 0 },
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

PlayerSchema.methods.attackMonster = function (monster) {
	
	let minAttack = (0.085 * ((this.accuracy - 25) / 100) * (1 * 2) * this.attack) + (this.level / 5) - (monster.defense * 2);
	let maxAttack = (0.085 * (this.accuracy / 100) * (1 * 2.5) * this.attack) + (this.level / 5) - (monster.defense * 2);

	let playerMinDef = (this.defense * 0.02 * 6);
	let playerMaxDef = (this.defense * 0.0956 * 6);

	let playerHP = this.health * 10;
	let monsterHP = monster.hp;

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

	while(playerHP > 0 && monsterHP > 0){

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

		monsterHP -= attack;

		totalDamage += attack;
		playerTotalHitCount++;

		if(monsterHP <= 0){
			win = true;
			break;
		}

		let playerDef = ((Math.random() * (playerMaxDef - playerMinDef)) + playerMinDef).toFixed(2);
		let monsterAttack = monster.attack - playerDef;

		if(Math.random() <= (this.evasion / 100) || monsterAttack < 0){
			monsterAttack = 0;
			monsterMissedCount++;
		}

		if(monsterAttack > 0){
			monsterHitCount++;
		}

		playerHP -= monsterAttack;
		totalDamageTaken += monsterAttack;

		monsterTotalHitCount++;

		if(playerHP <= 0){
			win = false;
			break;
		}
	}

	if(win){

		gold = Math.round(Math.random() * monster.gold);
		experience = monster.experience;

	}
		this.getLootStats();

	totalDamage = totalDamage.toFixed(2);
	totalDamageTaken = totalDamageTaken.toFixed(2);

	averageDamage = (totalDamage > 0 && playerHitCount > 0 ? (totalDamage / playerHitCount).toFixed(2) : 0);
	averageDamageTaken = (totalDamageTaken > 0 && monsterHitCount > 0 ? (totalDamageTaken / monsterHitCount).toFixed(2) : 0);

	return {
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
		monsterName: monster.name,
		playerWeapon: null
	};
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