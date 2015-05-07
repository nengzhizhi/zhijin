module.exports = function (options) {
	var seneca = this;
	seneca.add({role:'actor',cmd:'create'}, cmd_create);

	function cmd_create(args, callback){
		var actor = seneca.make$('actor');

		actor.name = args.name;
		actor.imgUrl = args.imgUrl;
		actor.program = args.program;

		actor.save$(function (err, actor){
			callback(err, actor);
		})
	}

	return { name : 'actor' };
}