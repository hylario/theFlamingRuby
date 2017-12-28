var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

var socketioJwt   = require("socketio-jwt");

var config = {
	secret: 'AIOogjw89(*En9gfwy8ge9'
}

var User = require('./models/user');
var Player = require('./models/player');

mongoose.connect('mongodb://localhost/theflamingruby');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', function(req, res, err){

	User.findOne({
		username: req.body.username
	}).populate('player').exec(function(err, user) {
		if (err) throw err;

		if (!user) {
			res.json({success: false, message: 'Authentication failed. User not found.'});
		} else {
		  	// check if password matches
		  	user.comparePassword(req.body.password, function (err, isMatch) {
			  	if (isMatch && !err) {
					// if user is found and password is right create a token
					var token = jwt.sign(user.toObject(), config.secret);
					// return the information including token as JSON
					res.json({success: true, token: token});
				} else {
					res.json({success: false, message: 'Authentication failed. Wrong password.'});
				}
			});
		}
	});
});

app.post('/register', function(req, res, err){

	if (!req.body.username || !req.body.email || !req.body.password) {
		res.json({success: false, message: 'Please pass username, e-mail and password.'});
	}else{
		var newUser = new User({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		});
		// save the user
		newUser.save(function(err) {
			if (err) {
				let message = [];
				if (err.name == 'ValidationError') {
					for (field in err.errors) {
						message.push(err.errors[field].message);
					}
				}
				return res.json({success: false, message});
			}
			res.json({success: true, message: 'Successful created new user.'});
		});
	}
});

io.use(socketioJwt.authorize({
  secret: 'AIOogjw89(*En9gfwy8ge9',
  handshake: true
}));

io.on('connection', function(client){

	console.log('Connected ' + client.id);
	console.log(client.decoded_token);

	client.on('attack', function(data){

		console.log(data);
		let playerId = client.decoded_token.player._id;

		Player.update({ _id: playerId }, { $inc: { experience: 1 }}, null, function(err){
			if(err) throw err;
		});
	});
});

server.listen(4200);