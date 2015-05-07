var formidable = require('formidable');
var fs = require('fs');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');

	seneca.act('role:web', {use:router(function (app){
		app.post('/common/upload', onUpload);
	})});

	function onUpload(req, res) {
		var form = new formidable.IncomingForm();
		form.uploadDir = 'public/upload/temp/';

		form.parse(req, function (err, fields, files){
			for (var key in files) {
				var file = files[key];
				console.log(file);
				var fileName = (new Date()).getTime();

				switch (file.type) {
					case "image/jpeg":
						fileName = fileName + ".jpg";
					break;
					case "image/png":
						fileName = fileName + ".png";
					break;
					default :
						fileName = fileName + ".png";
					break;					
				}
				var uploadDir = 'public/upload/' + fileName;
				fs.rename(file.path, uploadDir, function (err){
					console.log('err:' + err);
					if (err) {
						res.write({'err' : err});
						res.end();						
					}
					res.write({imgUrl:uploadDir});
					res.end();
				});
			}
		});

	}
}