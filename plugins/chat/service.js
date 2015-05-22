var async = require('async');
var uuid = require('node-uuid');
var error = require('./chatError.js');

module.exports = function(options) {
	var seneca = this;
	var rooms = [];
	
	seneca.io = require('socket.io')();

	seneca.add({role:'chat',cmd:'init'},		cmd_init);
	seneca.add({role:'chat',cmd:'create'},		cmd_create);
	seneca.add({role:'chat',cmd:'broadcast'},	cmd_broadcast);

	function cmd_init(args, callback){
		seneca.act({role:'room',cmd:'list'}, function (err, rooms) {
			async.each(
					rooms, 
					function (room, done) {
						seneca.act({role:'chat',cmd:'create',data:{roomId:room._id}}, function (err, result) {
							done(err);
						});
					},
					function (err) {
						seneca.io.listen(3003);
						callback(err);
					}
				);
		})
	}

	function cmd_create(args, callback){
		var roomId = args.data.roomId;

		rooms[roomId] = seneca.io.of('/chat/' + roomId);
		rooms[roomId].on('connection', function (socket){
			var token = uuid.v1();
			socket.emit('new connection', {token:token});

			socket.on('message', function (data) {
				console.log(data);
				rooms[roomId].emit('message', { msg : data.msg });
			});

			socket.on('disconnect', function(){
				console.log('disconnect token = ' + token);
			});
		})

		callback(null, rooms[roomId]);
	}

	function cmd_broadcast(args, callback){
		console.log('broadcast :' + args);
		var roomId = args.data.roomId;
		var command = args.data.command;
		var params = args.data.params;

		rooms[roomId].emit(command, params);
	}

	/*
	this.io = require('socket.io')();
	this.io.on('connection', function (socket){
		var token = uuid.v4();
		socket.emit('new connection', { 'token':token });


	});


	this.add({role:'chat',cmd:'broadcast'}, cmd_broadcast);


	function cmd_broadcast(args, callback) {
		var cmd = args.cmd;
		var ignores = args.ignores;

		this.io.emit(cmd, {'ignores':ignores});
	}
	*/
}