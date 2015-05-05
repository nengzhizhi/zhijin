var io = require('socket.io')();
var uuid = require('node-uuid');

var room = io.of('/002');
room.on('connection', function (socket){
	var token = uuid.v4();

	socket.emit('new connection', { data : '001'});

	socket.on('disconnect', function(){
		console.log('token:' + token);
	});
});

io.listen(3002);