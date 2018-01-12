var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var ExperienceSchema = new Schema({
	level: { type: Number, unique: true },
	experience: { type: Number },
	experience_to_next_level: { type: Number }
});

module.exports = mongoose.model('Experience', ExperienceSchema);