
module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');
	this.act(
			'role:web', 
			{
				use:router(function (app){
					app.get('/room/create', onCreate);
					app.post('/room/doCreate', onDoCreate);
					app.get('/room/list', onList);
					app.get('/room/detail', onDetail);
					app.get('/room/edit', onEdit);
				})
			});

	function onCreate(req, res) {
		res.render('admin/room/create', {result:''});
	}

	function onDoCreate(req, res) {
		if (!req.body.name) {
			res.render('admin/room/create', {result:{'error':'房间名不能为空！'}});
		}

		var room = seneca.make$('room');
		room.name = req.body.name;
		room.type = req.body.type;
		room.save$(function (err, room){
			if (room.id) {
				res.render('admin/room/create', {result:{'success':'创建成功！'}});
			}
		});

	}

	function onList(req, res) {
		var rooms = seneca.make$('room');
		rooms.list$({}, function (error, rooms){
			res.render('admin/room/list', {list:rooms});
		});
	}

	function onEdit(req, res) {
		var id = req.query.id;

		var collection = seneca.make$('room');
		collection.load$({id:req.query.id}, function (err, room){
			res.render('admin/room/edit', {'room':room});
		});
	}

	function onDetail(req, res){
		var id = req.query.id;

		var collection = seneca.make$('room');
		collection.load$({id:req.query.id}, function (err, room){
			res.render('admin/room/detail', {'room':room});
		});
	}

	return { name : 'backend' };
}