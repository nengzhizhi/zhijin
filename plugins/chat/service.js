var uuid = require('node-uuid');

module.exports = function(options) {
	var seneca = this;
	var rooms = [];
	
	seneca.io = require('socket.io')();
	seneca.io.listen(3003);

	seneca.add({role:'chat',cmd:'init'},		cmd_init);
	seneca.add({role:'chat',cmd:'create'},		cmd_create);
	seneca.add({role:'chat',cmd:'broadcast'},	cmd_broadcast);

	function cmd_init(args, callback){

	}

	function cmd_create(args, callback){
		var roomId = args.data.roomId;

		rooms[roomId] = seneca.io.of('/chat/' + roomId);
		rooms[roomId].on('connection', function (socket){
			var token = uuid.v1();
			socket.emit('new connection', {token:token});

			socket.on('message', function (data) {
				console.log(data);
				rooms[roomId].emit('message', 'some message');
			});

			socket.on('disconnect', function(){
				console.log('disconnect token = ' + token);
			});
		})
	}

	function cmd_broadcast(args, callback){
		var roomId = args.data.roomId;
		var sendData = args.data.sendData;

		rooms[roomId].emit('message', sendData);
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