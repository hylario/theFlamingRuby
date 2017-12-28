var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var Player = require('./player');

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

		let newPlayer = new Player({
			user: user._id
		});

		newPlayer.save(function(err){
			if(err) throw err;

			mongoose.model('User').update({ _id: user._id }, { player: newPlayer._id }, null, function(err){
				if(err) throw err;
			});
		});

		user._wasNew = false;
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