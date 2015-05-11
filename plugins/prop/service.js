var async = require('async');

module.exports = function(options) {
	var seneca = this;

	//开启互动 for power card
	seneca.add({role:'prop',cmd:'createProp'}			cmd_createProp)
	seneca.add({role:'prop',cmd:'listProp'},			cmd_listProp);
	seneca.add({role:'prop',cmd:'createInteraction'},	cmd_createInteraction);
	seneca.add({role:'prop',cmd:'updateInteraction'},	cmd_updateInteraction);
	seneca.add({role:'prop',cmd:'startInteraction'},	cmd_startInteraction);
	seneca.add({role:'prop',cmd:'stopInteraction'},		cmd_stopInteraction);


	function cmd_createProp(args, callback){
		var prop = seneca.make$('prop');

		prop.name = args.data.name;
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

		async.waterfall({
			checkRoom : function (next) {
				var collection = seneca.make$('interaction');

				collection.load$({roomId:roomId, status:true}, function (err, interaction)){
					if (interaction) {
						next("Room already has an interaction!", null);
					} else {
						next(null, interaction);
					}
				}
			},
			getProp : function (interaction, next) {
				var collection = seneca.make$('prop');

				collection.load$({id:propId}, function (err, prop){
					if (!prop) {
						next("prop not exist!", null);
					} else {
						next(null, prop);
					}
				});
			},
			createInteraction : function (prop, next) {
				var interaction = seneca.make$('interaction');
	
				interaction.prop = prop;
				interaction.roomId = roomId;
				interaction.countdown = {
					buy : 5,
					endBuy : 5,
					use : 5,
					endUse: 5
				}
				interaction.status = true;
				interaction.actors = actors;
				interaction.menu = prop.menu;
				interaction.result = {};
				interaction.save$(function (err, interaction){
					next(err, interaction);
				});
			}
		}, function (err, result){
			callback(err, result);
		});
	}


	function cmd_startInteraction(args, callback){
		var interactionId = args.data.interaction.id;

		async.waterfall({
			getInteraction : function (next){
				var collection = seneca.make$('interaction');

				collection.load$({id:interactionId, function (err, interaction) {
					next(err, interaction);
				}});
			},
		})
	}


	function cmd_countdownInteraction(args, callback){
		var interactionId = args.data.interaction.id;

		async.waterfall({
			getInteraction : function (next){
				var collection = seneca.make$('interaction');

				collection.load$({id:interactionId, function (err, interaction) {
					next(err, interaction);
				}});
			},
			countdown : function (interaction, next) {
				if ( !interaction.status ) {
					next();
				} else if (interaction.countdown.buy > 0) {
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
			}

		})
	}

	return { name : 'prop' };
}