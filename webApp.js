var express= require('express');
var ejs = require('ejs');

app = require('express')();
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use('/room', require('./controllers/roomRouter'));
app.listen(3000);