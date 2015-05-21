/*
 *	RestApi
 *	提供给前端调用的Restful接口
 */

var error = require('./roomError.js')();

module.exports = function (options) {
	var seneca = this;
	var router = seneca.export('web/httprouter');

	seneca.act('role:web',{use:router(function (app){
		app.get('/api/room/get', onGetRoom);
		//app.post('/api/room/foo', onFoo);
	})});

	seneca.use('/plugins/room/service');

	function onGetRoom(req, res) {
		seneca.act({role:'room',cmd:'get',data:{_id:req.query.id}}, function (err, room){
			if (err) {
				res.end(JSON.stringify({error : error.RoomNotExist(req.query.id)}));
			} else {
				res.writeHead(200,{'Content-Type': 'application/json'});
				res.end(JSON.stringify(room));
			}
		});
	}

	/*
	function onFoo(req, res){
		console.log(req.body);
		console.log(req.query);
	}
	*/
	return { name:'api' };
}