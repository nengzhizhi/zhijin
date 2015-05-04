module.exports = function(options){
	this.add('role:room,cmd:create', cmd_create);

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