console.log(module);

/*
function error( options ){
	options = options || {}

	var markers		= [module.filename]

	var errorMaker = function(code, msg, details){
		var err = new Error(msg);

		err.code		= code;
		err.msg			= msg;
		err.details		= details;

		err.callpoint 	= callpoint(err,markers); 
	}

	return errorMaker;
}

function callpoint( error, markers ){
	markers = _.isArray(markers) ? markers : [];


}*/