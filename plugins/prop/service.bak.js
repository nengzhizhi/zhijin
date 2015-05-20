var async = require('async');

module.exports = function(options) {
	var seneca = this;
	//此数据需要共享
	seneca.countdownHandle = [];

	//开启互动 for power card
	seneca.add({role:'prop',cmd:'createProp'},			cmd_createProp);
	seneca.add({role:'prop',cmd:'listProp'},			cmd_listProp);
	seneca.add({role:'prop',cmd:'createInteraction'},	cmd_createInteraction);
	seneca.add({role:'prop',cmd:'startInteraction'},	cmd_startInteraction);
	seneca.add({role:'prop',cmd:'stopInteraction'},		cmd_stopInteraction);
	//seneca.add({role:'prop',cmd:'claerInteraction'},	cmd_clearInteraction);

	function cmd_createProp(args, callback){
		var prop = seneca.make$('prop');

		prop.name = args.data.name;
		prop.type = args.data.type;
		prop.countdown = {
			"buy" : 5,
			"endBuy" : 5,
			"use" : 5,
			"endUse" : 5		
		};
		prop.menu = {
			"options" : [
				{
					"name" : "xxxxx",
					"icon" : "http://xxxx.png"
				}
			]		
		}

		prop.save$(function (err, entity){
			callback(err, entity);
		});
	}

	function cmd_listProp(args, callback){
		var collection = seneca.make$('prop');

		collection.list$(args.data, function (err, props){
			callback(err, props);
		});
	}

	function cmd_createInteraction(args, callback){
		var propId = args.data.propId;
		var roomId = args.data.roomId;
		var actors = args.data.actors;

		//TODO check input

		async.waterfall([
			function (next) {
				var collection = seneca.make$('interaction');

				collection.load$({roomId:roomId, status:true}, function (err, interaction){
					console.log(interaction);
					if (interaction) {
						next("Room already has an interaction!", null);
					} else {
						next(null, interaction);
					}
				})
			},function (interaction, next) {
				var collection = seneca.make$('prop');

				collection.load$({id:propId}, function (err, prop){
					if (!prop) {
						next("prop not exist!", null);
					} else {
						next(null, prop);
					}
				});
			},function (prop, next) {
				var interaction = seneca.make$('interaction');
	
				interaction.prop = prop;
				interaction.roomId = roomId;
				interaction.countdown = prop.countdown;
				interaction.status = true;
				interaction.actors = actors;
				interaction.menu = prop.menu;
				interaction.result = {};
				interaction.save$(function (err, interaction){
					next(err, interaction);
				});
			}
		], function (err, result){
			callback(err, result);
		});
	}

	function cmd_startInteraction(args, callback){
		var interactionId = args.data.interactionId;

		async.waterfall([
			function (next){
				var collection = seneca.make$('interaction');

				collection.load$({id:interactionId}, function (err, interaction) {
					next(err, interaction);
				});
			}, function (interaction, next) {
				if (interaction) {
					interaction.status = true;

					seneca.countdownHandle[interaction.id] = setInterval(function(){
						if (interaction.countdown.buy > 0) {
							interaction.countdown.buy --;
						} else if(interaction.countdown.endBuy > 0) {
							interaction.countdown.endBuy --;
						} else if(interaction.countdown.use > 0) {
							interaction.countdown.use --;
						} else if(interaction.countdown.endUse > 0) {
							interaction.countdown.endUse --;
						} else {
							interaction.status = false;
						}

						if (interaction.status == false) {
							clearInterval(seneca.countdownHandle[interaction.id]);
						}

						console.log('interaction = ' + interaction + '\r\n');
					}, 1000);

					next(null, null);
				} else {
					next("interaction dose not exist!", null);
				}
			}
		], function (err, result){
			callback(err, result);
		});
	}

	function cmd_stopInteraction(args, callback){
		var interactionId = args.data.interactionId;

		async.waterfall([
				function (next) {
					var collection = seneca.make$('interaction');

					collection.load$({id:interactionId}, function (err, interaction){
						next(err, interaction);
					});
				}, function (interaction, next){
					if (!interaction){
						next("can't find interaction");
					} else {
						if (interaction.status) {
							clearInterval(seneca.countdownHandle[interaction.id]);
							interaction.status = false;
							interaction.save$(function (err, entity){
								next(err, entity);
							});
						}
						next(null, null);
					}
				}
			], function (err, result){
				callback(err, result);
			});
	}

	return { name : 'prop' };
}