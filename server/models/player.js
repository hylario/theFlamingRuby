var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var PlayerSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	level: { type: Number, default: 0 },
	experience: { type: Number, default: 0 },
	cooldown: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Player', PlayerSchema);