module.exports = function (options) {
	var seneca = this;
	seneca.add({role:'actor',cmd:'create'}, cmd_create);
	seneca.add({role:'actor',cmd:'list'},	cmd_list);

	function cmd_create(args, callback){
		var actor = seneca.make$('actor');

		actor.name = args.data.name;
		actor.imgUrl = args.data.imgUrl;
		actor.program = args.data.program;

		actor.save$(function (err, actor){
			callback(err, actor);
		})
	}

	function cmd_list(args, callback){
		var collection = seneca.make$('actor');

		collection.list$({}, function (err, actors){
			callback(err, actors);
		});
	}

	return { name : 'actor' };
}