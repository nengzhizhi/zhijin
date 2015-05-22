var seneca = require('seneca')();
var mongoose = require('mongoose');
mongoose.connect('mongodb://zhijin:b933defa@112.124.117.146:27017/zhijin');

seneca.use('/plugins/chat/service');

seneca
.client({host:'127.0.0.1',port:1001,pin:{role:'room',cmd:'*'}})
.listen({
	host : '127.0.0.1',
	port : '1002'
})
.ready(function(){
	seneca.act({role:'chat',cmd:'init'});
	console.log('chat service start success!');
})
