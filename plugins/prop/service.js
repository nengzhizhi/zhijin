module.exports = function(options) {
	var seneca = this;
	seneca.add({role:'prop',cmd:'list'}, cmd_list);

	function cmd_list(args, callback){
		var collection = seneca.make$('prop');

		collection.list$(args.data, function (err, props){
			callback(err, props);
		});
	}

	return { name : 'prop' };
}