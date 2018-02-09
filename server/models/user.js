var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

var Player = require('./player');
var Item = require('./item');
var PlayerItem = require('./player_item');

var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	player: { type: Schema.Types.ObjectId, ref: 'Player' }
});

UserSchema.path('username').validate(function(value, done) {
    this.model('User').count({ username: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        done(!count);
    });
}, 'Username already exists');

UserSchema.path('email').validate(function(value, done) {
    this.model('User').count({ email: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        done(!count);
    });
}, 'Email already exists');

UserSchema.pre('save', function (next) {
	var user = this;
	this._wasNew = this.isNew;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, null, function (err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.post('save', function(user) {
	if(user._wasNew){

		user._wasNew = false;

		let newPlayer = new Player({
			user: user._id
		});

		newPlayer.save(function(err){
			if(err) throw err;

			mongoose.model('User').update({ _id: user._id }, { player: newPlayer._id }, null, function(err){
				if(err) throw err;

			});

			Item.find({name: {'$in': ['Axe', 'Attack Gem']}}).exec(function(err, items){
				if(err) throw err;

				async.eachSeries(items, function(item, callback){

					let playerItem = new PlayerItem({
						player: newPlayer._id,
						item: item._id,
						itemType: item.itemType,
						name: item.name,
						level: item.level,
						hp: item.hp,
						attack: item.attack,
						defense: item.defense
					});

    				playerItem.save(function(err){
    					if(err) return callback(err);

    					callback(null);
    				});
				}, function(err){
					if(err) throw err;

					console.log('Complete');
				});
			});
		});
	}
});

UserSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);