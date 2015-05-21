var ejs = require('ejs');
var express = require('express');
var seneca = require('seneca')({
		debug:{
			undead:false
		}
	});
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://zhijin:b933defa@112.124.117.146:27017/zhijin');

seneca.use('./plugins/room/api');
seneca.use('./plugins/chat/service');

var api = require('express')();

/*
开启聊天室 测试用
*/
seneca.act({role:'chat',cmd:'create',data:{roomId:'555caadf6ee1e5b41f2ec748'}}, function (err, result){

});



api.engine('.html', ejs.__express) // for app
api.set('view engine', 'html') //for app
api
.use(express.static(__dirname + '/public'))
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())
.use(seneca.export('web'))
.use('/room', require('./controllers/roomRouter')) //for app
.listen(3001);