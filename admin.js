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

seneca.use('/plugins/room/backend');
seneca.use('/plugins/program/backend');
seneca.use('/plugins/prop/backend');
seneca.use('/plugins/actor/backend');
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