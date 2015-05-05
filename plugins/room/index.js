module.exports = function(options){
	this.add('role:room,cmd:create',cmd_create);
	this.add('role:room,cmd:show',	cmd_show);

	function cmd_show(args, callback){
		var collection = this.make$('room');

		if (!args.id) {
			throw new Error("id null!");
			return;
		}

		collection.load$({id:args.id}, function (err, room) {
			if (room) {
				callback(err, room);
			} else {
				callback('invalid room id!',null);
			}
		});
	}

	function cmd_create(args, callback){
		var room = this.make('room');
		room.name = args.name;

		room.save$(function (err, room){
			if (err) {
				console.error(err);
				//callback(err, null);
			}

			room.load$({id:room.id}, function (err, room) {
				if (err) return console.error(err);
				console.log('loaded : ' + room);
			});
		})
	}

	return { name : 'room'};
}