var programModel = require('./model.js').programModel;
var episodeModel = require('./model.js').episodeModel;

module.exports = function(options){
	var seneca = this;

	seneca.add({role:'program',cmd:'createProgram'},	cmd_createProgram);
	seneca.add({role:'program',cmd:'listProgram'},		cmd_listProgram);
	seneca.add({role:'program',cmd:'getProgram'},		cmd_getProgram);
	seneca.add({role:'program',cmd:'createEpisode'},	cmd_createEpisode);
	seneca.add({role:'program',cmd:'getEpisode'},		cmd_getEpisode);
	seneca.add({role:'program',cmd:'updateEpisode'},	cmd_updateEpisode);
	seneca.add({role:'program',cmd:'listEpisode'},		cmd_listEpisode);

	function cmd_createProgram(args, callback){
		var instance = new programModel();
		instance.name = args.data.name;
		instance.logo = args.data.logo;
		instance.description = args.data.description;

		instance.save(function (err){
			callback(err, instance);
		});
	}

	function cmd_listProgram(args, callback){
		programModel
		.find(args.data)
		.exec( function (err, programs){
			callback(err, programs);
		});
	}

	function cmd_getProgram(args, callback){
		programModel
		.findOne(args.data)
		.exec( function (err, program){
			callback(err, program);
		});
	}

	function cmd_createEpisode(args, callback){
		var instance = new episodeModel();
		instance.startTime = args.data.startTime;
		instance.endTime = args.data.endTime;
		instance.name = args.data.name;
		instance.number = args.data.number;
		instance.program = args.data.program;

		instance.save(function (err){
			callback(err, instance);
		});
	}

	function cmd_getEpisode(args, callback){
		episodeModel
		.findOne(args.data)
		.populate('program')
		.exec( function (err, episode){
			callback(err, episode);
		});
	}

	function cmd_listEpisode(args, callback){
		episodeModel
		.find(args.data)
		.populate('program')
		.exec( function (err, episodes){
			callback(err, episodes);
		});
	}

	function cmd_updateEpisode(args, callback){
		episodeModel
		.where({_id:args.data.id})
		.update(args.data, callback);
	}


}