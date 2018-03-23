var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	itemType: { type: String },
	itemSubType: { type: String },
	name: { type: String, unique: true },
	level: { type: Number },
	hp: { type: Number },
	attack: { type: Number, default: 0 },
	defense: { type: Number, default: 0 },
	image: String
});

module.exports = mongoose.model('Item', ItemSchema);