module.exports = function (options) {
	var seneca = this;

	seneca.add({role:'actor',cmd:'create'},	cmd_create);
	seneca.add({role:'actor',cmd:'list'},	cmd_list);
	seneca.add({role:'actor',cmd:'delete'},	cmd_delete);

	function cmd_create(args, callback){
		var actor = seneca.make$('actor');

		actor.name = args.data.name;
		actor.avatar = args.data.avatar;
		actor.program = args.data.program;

		actor.save$(function (err, actor){
			callback(err, actor);
		})
	}

	function cmd_list(args, callback){
		var collection = seneca.make$('actor');

		collection.list$(args.data, function (err, actors){
			callback(err, actors);
		});
	}

	function cmd_delete(args, callback) {
		var collection = seneca.make$('actor');

		collection.remove$({id:args.data.id}, function (err, entity){
			callback(err, entity);
		})
	}

	return { name : 'actor' };
}