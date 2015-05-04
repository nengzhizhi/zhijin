var express= require('express');
var ejs = require('ejs');
var seneca = require('seneca')();
var bodyParser = require('body-parser');


seneca.use('./plugins/room/backend');
seneca.use('./plugins/program/backend');

var adminApp = require('express')();
//adminApp.set('view engine', 'ejs'); 
adminApp.engine('.html', ejs.__express);
adminApp.set('view engine', 'html');
adminApp.use(bodyParser.urlencoded({ extended: false }));
adminApp.use(bodyParser.json());
adminApp.use(express.static(__dirname + '/public'));
adminApp.use(seneca.export('web'));
adminApp.listen(3001);