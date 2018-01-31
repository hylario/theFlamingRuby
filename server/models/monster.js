var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MonsterSchema = new Schema({
	name: { type: String, unique: true },
	level: { type: Number },
	hp: { type: Number },
	attack: { type: Number, default: 0 },
	defense: { type: Number, default: 0 },
	experience: { type: Number },
	gold: { type: Number, default: 0},
	loot: [{
		rarity: Number, 
		item: { type: Schema.Types.ObjectId, ref: 'Item' }
	}]
});

module.exports = mongoose.model('Monster', MonsterSchema);