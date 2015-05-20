var async = require('async');
var roomModel = require('./model.js').roomModel;

module.exports = function (options) {
	var seneca = this;

	this.add({role:'room',cmd:'get'},		cmd_get);
	this.add({role:'room',cmd:'list'},		cmd_list);
	this.add({role:'room',cmd:'create'},	cmd_create);
	this.add({role:'room',cmd:'update'},	cmd_update);
	this.add({role:'room',cmd:'delete'},	cmd_delete);

	function cmd_get(args, callback){
		roomModel
		.findOne(args.data)
		.populate('episode')
		.populate('program')
		.exec(function (err, room){
			callback(err,room);
		});
	}

	function cmd_list(args, callback){
		roomModel
		.find(args.data)
		.populate('episode')
		.populate('program')
		.exec(function (err, rooms){
			callback(err, rooms);
		});
	}

	function cmd_create(args, callback){
		var instance = new roomModel();
		instance.name = args.data.name;
		instance.status = 'waiting';
		instance.stream = args.data.stream;
		instance.type = args.data.type;
		instance.episode = args.data.episode;

		instance.save(function (err){
			callback(err, instance);
		});
	}

	function cmd_update(args, callback){
		roomModel
		.where({_id:args.data.id})
		.update(args.data, callback);
	}

	function cmd_delete(args, callback){
		roomModel
		.where()
		.findOneAndRemove({_id:args.data.id}, callback);
	}
}