/*
 *	RestApi
 *	提供给前端调用的Restful接口
 */

module.exports = function (options) {
	var router = this.export('web/httprouter');


	this.act('role:web',{use:router(function (app){
		app.post('/api/room/get', onGetRoom);
	})});

	this.use('/plugins/room/service');

	function onGetRoom(req, res) {
		this.act({role:'room',cmd:'get',id:req.query.id}, function (err, room){
			res.writeHead(200,{'Content-Type': 'application/json'});
			res.end(JSON.stringify(room));
		});
	}

	return { name:'api' };
}


	/*
	this.add('role:api,info:test', hello);

	this.add('init:api', function(args, callback){
		this.act('role:web', {
			use:{
				prefix:'/',
				pin:'role:api,info:*',
				map:{
					test:true
				}
			}
		});

		callback();
	});	

	function hello(args, callback){
		callback(null, {msg:'hello!'});
	}

	return { name:'api' };
	*/

/*
module.exports = function (options) {
	var router = this.export('web/httprouter');

	this.act(
				'role:web',
				{
					use:router(function (app){
						app.get("/api/:action",function(req,res){

	// respond manually
	res.writeHead(200,{
	'Content-Type': 'application/json'
	})
	res.end( JSON.stringify({action:req.params.action}) )
	})
	})})
	return { name : 'api' };
}*/

/*
module.exports = function (options) {
	var router = this.export('web/httprouter');

	this.act(
			'role:web',
			{
				use:router(function (app){
					app.get("/room/create", create);
				})
			}
		);

	function create(req, res){
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify(
				{
					action:'create'
				}));
	}
}
*/