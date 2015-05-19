var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;
var seneca = require('seneca')();

seneca.use('/plugins/room/service2');

mongoose.connect('mongodb://zhijin:b933defa@112.124.117.146:27017/zhijin');
var db = mongoose.connection;

db.once('open', function (callback){
	var foo = {
		name : 'foo',
		episode : '5559da9fab30d18b0dd298fc'
	}
	/*
	seneca.act({role:'room',cmd:'create',data:foo}, function (err, result){
		console.log(result);
	});
	*/
	/*
	seneca.act({
			role:'room',
			cmd:'get',
			data:{ _id :'555ac16a99fbcf881599b942'}
		}, function (err, result){
			console.log(result);
	});
	*/

	/*
	seneca.act({
			role : 'room',
			cmd : 'list',
			data : {}
		}, function (err, result){
			console.log(result);
		});
	*/

	seneca.act({
			role : 'room',
			cmd : 'update',
			data : {
				name : 'foo_update1111',
				episode : '5559da9fab30d18b0dd298fc',
				id : '555ac16a99fbcf881599b942'
			}
		}, function (err, result){
			console.log(result);
		});
});
