/*
 *	service 提供内部微服务之间的接口服务，或者提供RestApi的调用
 *	前期在使用时直接用seneca代码调用
 *	后期部署到集群，通过seneca.client()调用
 */

module.exports = function (options) {
	this.use(
				'mongo-store',
				{
					name : 'zj-room',
					host : '192.168.1.220',
					port : 27019
				}
			);

	this.add({role:'room',cmd:'get'}, cmd_get);

	function cmd_get(args, callback){
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

	return { name : 'service'}
}