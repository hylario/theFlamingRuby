var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerItemSchema = new Schema({
	player: { type: Schema.Types.ObjectId, ref: 'Player' },
	item: { type: Schema.Types.ObjectId, ref: 'Item' },
	itemType: { type: String },
	itemSubType: { type: String },
	name: { type: String },
	level: { type: Number },
	hp: { type: Number },
	attack: { type: Number, default: 0 },
	defense: { type: Number, default: 0 },
	slots: { type: Number, default: 0 },
	gems: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
	image: String,
	created: { type: Date, default: new Date() }
});

module.exports = mongoose.model('PlayerItem', PlayerItemSchema);