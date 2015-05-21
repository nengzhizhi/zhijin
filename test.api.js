var http = require('http');


var data = {
	id : '555caadf6ee1e5b41f2ec748'
}

data = require('querystring').stringify(data);

var option = {
	method : 'POST',
	host : 'localhost',
	port : 3001,
	path : '/api/room/get',
	headers : {
		"Content-Type": 'application/x-www-form-urlencoded',  
		"Content-Length": data.length  		
	}
}

var req = http.request(option, function (response) {
	if (response.statusCode == 200) {
		var body = "";
		response
		.on('data', function (data){
			body += data;
		})
		.on('end', function (){
			console.log(body);
		});
	}
	else {
		console.log("error");
	}
})
req.write(data);
req.end();