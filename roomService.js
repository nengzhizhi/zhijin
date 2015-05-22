var seneca = require('seneca')();
var mongoose = require('mongoose');
mongoose.connect('mongodb://zhijin:b933defa@112.124.117.146:27017/zhijin');

seneca.use('/plugins/room/service');

seneca.listen({
	host : '127.0.0.1',
	port : 1001
})
.ready(function(){
	console.log('room service start success!');
})