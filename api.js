var seneca = require('seneca')();

seneca.use('./plugins/room/api');

var api = require('express')();
api
	.use(seneca.export('web'))
	.listen(3001);