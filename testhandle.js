var seneca = require('seneca')();

seneca.use(
	'mongo-store',
	{name:'zhijin', host:'112.124.117.146', port: 27017, username:'zhijin', password:'b933defa'}
);

seneca.use('/plugins/prop/service');


//test
/*
seneca.act({role:'prop', cmd:'createProp', data:{name:'xxx',type:''}}, function (err, result){
	console.log(result);
});
*/
/*
seneca.act({role:'prop', cmd:'listProp', data:{}}, function (err, result){
	console.log(result);
});
*/
/*
seneca.act({role:'prop', cmd:'createInteraction', data:{}}, function (err, result){
	console.log(result);
});
*/

seneca.act({
			role:'prop', 
			cmd:'startInteraction', 
			data:{interactionId:'5551950726e880101f47c8b1'}
		}, function (err, result){
			console.log("start result:" + result);
		});

/*
seneca.act({
			role : 'prop',
			cmd : 'stopInteraction',
			data:{interactionId:'5551950726e880101f47c8b1'}
		}, function (err, result) {
			console.log("stop result:" + result);
		});
*/


