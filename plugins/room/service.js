/*
 *	service 提供内部微服务之间的接口服务，或者提供RestApi的调用
 *	前期在使用时直接用seneca代码调用
 *	后期部署到集群，通过seneca.client()调用
 */

module.exports = function (options) {
	var seneca = this;

	this.add({role:'room',cmd:'get'},		cmd_get);
	this.add({role:'room',cmd:'list'},		cmd_list);
	this.add({role:'room',cmd:'create'},	cmd_create);
	this.add({role:'room',cmd:'update'},	cmd_update);

	function cmd_get(args, callback){
		var collection = seneca.make$('room');
		
		collection.load$(args.data, function (err, room) {
			callback(err, room);
		});
	}

	function cmd_list(args, callback){
		var collection = seneca.make$('room');

		collection.list$({}, function (err, rooms) {
			callback(err, rooms);
		});		
	}

	function cmd_create(args, callback){
		var room = seneca.make$('room');
		room.name = args.data.name;
		room.type = args.data.type;
		room.episode = {};

		room.save$(function (err, room){
			callback(err, room);
		});
	}

	function cmd_update(args, callback){
		var collection = seneca.make$('room');

		for(var key in args.data){
			collection[key] = args.data[key];
		}

		collection.save$(function (err, room){
			callback(err, room);
		})
	}

	return { name : 'service' };
}