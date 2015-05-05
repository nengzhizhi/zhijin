//var seneca = require('seneca')();

/*
seneca.use( 'mongo-store',
		  {name:'seneca', host:'192.168.1.220', port: 27019}
		);
seneca.use('./plugins/room');

seneca.ready(function(){
		seneca.act({role:'room', cmd:'create', name:'test'}, function (err, result) {
			console.log(result);
		});
	});
*/

/*
seneca.use('./plugins/room/api');

var app = require('express')();

app
	.use(seneca.export('web'))
	.listen(3001);

*/

var app = require('express')();
app.use('/room', require('./controllers/roomRouter'));
app.listen(3000);