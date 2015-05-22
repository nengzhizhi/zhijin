var express= require('express');
var ejs = require('ejs');
var seneca = require('seneca')();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://zhijin:b933defa@112.124.117.146:27017/zhijin');

seneca.use(
	'mongo-store',
	{name:'zhijin', host:'112.124.117.146', port: 27017, usename:'zhijin', password:'b933defa'}
);

var options = {
	service : {
		room : {
			host : '127.0.0.1',
			port : 1001 
		},
		chat : {
			host : '127.0.0.1',
			port : 1002
		}
	}
}
seneca.client({host:'127.0.0.1',port:1001,pin:{role:'room',cmd:'*'}})

seneca.use('/plugins/room/backend', options);
seneca.use('/plugins/program/backend', options);
seneca.use('/plugins/prop/backend', options);
seneca.use('/plugins/actor/backend', options);
seneca.use('/plugins/common')

var adminApp = require('express')();
//adminApp.set('view engine', 'ejs'); 
adminApp.engine('.html', ejs.__express);
adminApp.set('view engine', 'html');
adminApp.use(bodyParser.urlencoded({ extended: false }));
adminApp.use(bodyParser.json());
adminApp.use(express.static(__dirname + '/public'));
adminApp.use(seneca.export('web'));
adminApp.listen(3001);