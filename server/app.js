['log'].forEach(a=>{let b=console[a];console[a]=(...c)=>{try{throw new Error}catch(d){b.apply(console,[d.stack.split('\n')[2].trim().substring(3).replace(__dirname,'').replace(/\s\(./,' at ').replace(/\)/,''),'\n	',...c])}}});

var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var fs = require('fs');

var base64 = require('node-base64-image');

var setup = require('./setup');
var api = require('./api');

var socketioJwt   = require("socketio-jwt");

var config = {
	secret: 'AIOogjw89(*En9gfwy8ge9'
}

var User = require('./models/user');
var Player = require('./models/player');
var Experience = require('./models/experience');
var Monster = require('./models/monster');
var PlayerItem = require('./models/player_item');

mongoose.connect('mongodb://localhost/theflamingruby');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/setup', setup);

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

	client.on('attack', api.attack);

	client.on('update', () => {api.update(client)});

	client.on('getMonstersList', function(){

		Monster.find({}, function(err, monsters){
			if(err) throw err;

			if(monsters){
				let monstersList = [];

				monsters.forEach(function(v,i){
					monstersList.push({
						value: v._id,
						label: v.name
					});
				});

				client.emit('monstersList', monstersList);
			}
		});
	});

	client.on('getMonsterInfo', function(monster_id){

		Monster.findOne({_id: monster_id}, function(err, monster){
			if(err) throw err;

			if(monster){

				if(fs.existsSync(monster.image)){
					base64.encode(monster.image, {string: true, local: true}, function(err, result){
						if(err) throw err;

						monster.image = "data:image/gif;base64," + result;

						client.emit('monsterInfo', monster);
					});
				}else{

					monster.image = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

					client.emit('monsterInfo', monster);
				}
			}
		});
	});

	client.on('getInventory', api.getInventory);
});

server.listen(4200);