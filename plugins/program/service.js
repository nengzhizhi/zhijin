module.exports = function(options){
	var seneca = this;
	seneca.add({role:'program',cmd:'list'}, cmd_list);
	seneca.add({role:'program',cmd:'getEpisode'}, cmd_getEpisode);

	function cmd_list(args, callback) {
		var collection = seneca.make$('program');

		collection.list$({}, function (err, programs){
			callback(err, programs);
		});
	}

	function cmd_getEpisode(args, callback) {
		var collection = seneca.make$('episode');

		collection.load$({id:args.data.id}, function (err, episode){
			callback(err, episode);
		});
	}

	return { name : 'program' };
}