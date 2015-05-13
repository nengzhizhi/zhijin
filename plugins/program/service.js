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
		var program = seneca.make$('program');
		program.name = args.data.name;
		program.logo = args.data.logo;
		program.description = args.data.description;

		program.save$(function (err, entity){
			callback(err, entity);
		});
	}

	function cmd_listProgram(args, callback) {
		var collection = seneca.make$('program');

		collection.list$(args.data, function (err, programs){
			callback(err, programs);
		});
	}

	function cmd_getProgram(args, callback){
		var collection = seneca.make$('program');

		collection.load$(args.data, function (err, program){
			callback(err, program);
		});
	}

	function cmd_createEpisode(args, callback) {
		var episode = seneca.make$('episode');

		episode.name = args.data.name;
		episode.number = args.data.number;
		episode.program = args.data.program;
		episode.startTime = args.data.startTime;
		episode.endTime = args.data.endTime;
		episode.actors = [];
		episode.props = [];

		episode.save$(function (err, entity){
			callback(err, entity);
		});
	}

	function cmd_getEpisode(args, callback) {
		var collection = seneca.make$('episode');

		collection.load$(args.data, function (err, episode){
			callback(err, episode);
		});
	}

	function cmd_updateEpisode(args, callback) {
		var collection = seneca.make$('episode');

		for(var key in args.data){
			collection[key] = args.data[key];
		}

		collection.save$(function (err, episode){
			callback(err, episode);
		})
	}

	function cmd_listEpisode(args, callback) {
		var collection = seneca.make$('episode');

		collection.list$(args.data, function (err, episodes){
			callback(err, episodes);
		});		
	}

	return { name : 'program' };
}