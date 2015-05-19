var actorModel = require('./model.js').actorModel;

module.exports = function (options) {
	var seneca = this;

	seneca.add({role:'actor',cmd:'create'},	cmd_create);
	seneca.add({role:'actor',cmd:'list'},	cmd_list);
	seneca.add({role:'actor',cmd:'delete'},	cmd_delete);

	function cmd_create(args, callback){
		var instance = new actorModel();
		instance.name = args.data.name;
		instance.avatar = args.data.avatar;
		instance.program = args.data.program;

		instance.save(function (err){
			callback(err, instance);
		});
	}

	function cmd_list(args, callback){
		actorModel
		.find(args.data)
		.exec(function (err, actor){
			callback(err, actor);
		});		
	}

	function cmd_delete(args, callback) {
		actorModel
		.where()
		.findOneAndRemove({_id:args.data.id}, callback);
	}

	return { name : 'actor' }
}