var uuid = require('node-uuid');

module.exports = function(options) {
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
}