var fs = require('fs');
var async = require('async');

var Monster = require('./models/monster');
var Item = require('./models/item');

String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

module.exports = function(req, res, err){

	async.series({
		function(callback){
			Item.collection.remove();
			Monster.collection.remove();
			callback();
		},
		items: function(callback){
			fs.readFile('jsons/items.json', 'utf8', function (err, items) {
		        if (err) throw err;

		        let result = [];
		        let errors = [];

		        items = JSON.parse(items);

		        async.eachOfSeries(items, function(v, i, callback1){

		        	let item = new Item(v);

		        	item.save(function(err){
		        		if(err){
		        			errors.push(err.message);
		        		}else{
		        			result.push(item.name + " - OK");
		        		}

		        		callback1();
		        	});
		        }, function(err){

		        	callback(err, {result, errors});
		        });
		    });
		},
		monsters: function(callback){
			fs.readFile('jsons/monsters.json', 'utf8', function (err, monsters) {
		        if (err) throw err;

		        let result = [];
		        let errors = [];

		        monsters = JSON.parse(monsters);

		        async.eachSeries(monsters, function(v, callback1){

		        	v.name = v.name.capitalize(true);

		        	if(v.loot.length > 0){
		        		let itemNames = v.loot.map((a) => (a.item));
		        		let loot = [];

		        		Item.find({name: {$in: itemNames}}).exec(function(err, items){
		        			async.eachSeries(items, function(item, callback2){
		        				let l = v.loot.filter( (a) => (a.item == item.name) );

		        				if(!l.length) callback2();

		        				loot.push({
		        					rarity: l[0].rarity,
		        					item: item._id
		        				});

		        				callback2();
		        			}, function(err){
		        				
		        				v.loot = loot;
		        				console.log(v);
		        				let monster = new Monster(v);
		        				console.log(monster);

		        				monster.save(function(err){
					        		if(err){
					        			errors.push(err.message);
					        		}else{
					        			result.push(monster.name + " - OK");
					        		}

					        		callback1();
					        	});
		        			});
		        		});
		        	}else{

        				let monster = new Monster(v);

			        	monster.save(function(err){
			        		if(err){
			        			console.log(err);
			        			errors.push(err.message);
			        		}else{
			        			result.push(monster.name + " - OK");
			        		}

			        		callback1();
			        	});
			        }
		        }, function(err){

		        	callback(err, {result, errors});
		        });
		    });
		}
	}, function(err, results){

		res.send("<pre>" + JSON.stringify(results, undefined, 2) + "</pre>");
	});
}