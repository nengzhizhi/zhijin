var async = require('async');
var propModel = require('./model.js').propModel;
var interactionModel = require('./model.js').interactionModel;

module.exports = function (options) {
	var seneca = this;

	seneca.use('/plugins/chat/service');

	//此数据需要共享
	seneca.countdownHandle = [];

	seneca.add({role:'prop', cmd:'createProp'}, cmd_createProp);
	seneca.add({role:'prop', cmd:'listProp'}, cmd_listProp);
	seneca.add({role:'prop', cmd:'createInteraction'}, cmd_createInteraction);
	seneca.add({role:'prop', cmd:'startInteraction'}, cmd_startInteraction);
	seneca.add({role:'prop', cmd:'stopInteraction'}, cmd_stopInteraction);
	seneca.add({role:'prop', cmd:'listInteraction'}, cmd_listInteraction);


	function cmd_createProp(args, callback){
		var instance = new propModel();
		instance.name = args.data.name;
		instance.type = args.data.type;
		instance.program = args.data.program;
		instance.countdown.buy = args.data.buy;
		instance.countdown.endBuy = args.data.endBuy;
		instance.countdown.use = args.data.use;
		instance.countdown.endUse = args.data.endUse;
		var option = {
			name : args.data.option_name,
			image : args.data.options_image
		}
		instance.menu.options.push(option);

		instance.save(function (err){
			callback(err, instance);
		});
	}

	function cmd_listProp(args, callback){
		propModel
		.find(args.data)
		.populate('program')
		.exec( function (err, props){
			callback(err, props);
		});
	}

	function cmd_createInteraction(args, callback){
		async.waterfall([
			function (next) {
				propModel
				.findOne({_id:args.data.propId})
				.populate('program')
				.exec( function (err, prop) {
					console.log(prop);
					next(err, prop);
				});
			}, function (prop, next) {
				var instance = new interactionModel();
				instance.prop = args.data.propId;
				instance.room = args.data.roomId;
				instance.countdown = prop.countdown;
				instance.status = true;
				instance.actors = args.data.actors;
				instance.result = {}

				instance.save(function (err) {
					next(err, instance);
				});
			}
		], function (err, result){
			callback(err, result);
		});
	}

	function cmd_startInteraction(args, callback){
		var interactionId = args.data.interactionId;

		async.waterfall([
			function (next) {
				interactionModel
				.findOne({_id:interactionId})
				.populate('room')
				.populate('prop')
				.exec( function (err, interaction){
					next(err, interaction);
				})		
			}, function (interaction, next){
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
							interaction.result = { result : 'success' };
						}

						if (interaction.status == false) {
							clearInterval(seneca.countdownHandle[interaction.id]);
						}

						interaction.save();

						console.log('interaction = ' + interaction + '\r\n');

						seneca.act({role:'chat',cmd:'broadcast',data:{
							command : 'interact',
							params : {
								interaction : interaction
							}
						}});
					}, 1000);

					interaction.save(function (err){
						next(err, interaction);
					});
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
				interactionModel
				.findOne({_id:interactionId})
				.populate('room')
				.populate('prop')
				.exec( function (err, interaction){
					next(err, interaction);
				})					
			}, function (interaction, next) {
				if (!interaction){
					next("can't find interaction", null);
				} else {
					if (interaction.status) {
						clearInterval(seneca.countdownHandle[interaction.id]);
						interaction.status = false;
						interaction.save(function (err){
							next(err, interaction);
						});
					} else {
						next(null, null);
					}
				}					
			}
		], function (err, result){
			callback(err, result);
		});
	}

	function cmd_listInteraction(args, callback){
		interactionModel
		.find(args.data)
		.populate('room')
		.populate('prop')
		.populate('actors','name')
		.exec( function (err, interactions) {
			callback(err, interactions);
		})
	}
}