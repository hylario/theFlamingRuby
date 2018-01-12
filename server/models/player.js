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
	health: { type: Number, default: 0 },
	attack: { type: Number, default: 0 },
	defense: { type: Number, default: 0 },
	accuracy: { type: Number, default: 0 },
	evasion: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', PlayerSchema);