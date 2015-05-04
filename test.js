/*
var seneca = require('seneca')();

seneca.add('role:admin,cmd:test', function (args, callback){
	callback(null, {t:'123'});
});

seneca.act('role:web', {use:{
	prefix	: '/admin',
	pin		: {role:'admin',cmd:'*'},
	map		: {
		test : true
	}
}});

var app = require('express')();
app.use(seneca.export('web'));
app.listen(3001);
*/

var express= require('express');
var ejs = require('ejs');

var seneca = require('seneca')();
var router = seneca.export('web/httprouter');

seneca.act('role:web', {use:router(function (app){
	app.get('/api', function (req, res){
		res.render('admin/room/test');
	});
})});

var app = require('express')();
app.set('view engine', 'ejs'); 
app.use(seneca.export('web'));
app.listen(3001);


/*
var express = require('express');
var ejs = require('ejs');

var app = express();
app.set('view engine', 'ejs'); 
app.get('/', function (req, res){
	res.render('index', {title: 'Hey'});
});
app.listen(3001);
*/