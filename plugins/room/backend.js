
module.exports = function (options) {
	var router = this.export('web/httprouter');

	this.use(
			'mongo-store',
			{name:'gir_room', host:'192.168.1.220', port: 27019}
		);

	this.act(
			'role:web', 
			{
				use:router(function (app){
					app.get('/room/create', onCreate);
					app.get('/room/list', onList);
				})
			});

	function onCreate(req, res) {
		res.render('admin/room/create');
	}

	function onList(req, res) {
		var rooms = this.make$('room');
		rooms.list$({}, function (error, rooms){
			res.render('admin/room/list', {list:rooms});
		});
	}

	return { name : 'backend' };
}