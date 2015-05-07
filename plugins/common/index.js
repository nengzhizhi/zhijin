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

function toImageHTML(labelText, id) {
	var html = 
	'<div class="form-group">' +
		'<label for="id_name" class="control-label col-sm-2">' + labelText + '</label>' +
		'<div class="col-sm-4">' +
		'<input id="' + id + '" type="file" class="form-control">' +
		'</div>' +
		'<button class="btn btn-success" onClick="upload(\'' + id + '\' , \'' + id + 'Url\')" style="float:left">上传</button>' +
		'<input type="hidden" id="' + id + 'Url">' +
	'</div>';
	return html;
}

function bootstrapField(name, object) {
	object.widget.classes = object.widget.classes || [];
	if(object.widget.classes.indexOf('form-control') < 0){
		object.widget.classes.push('form-control');
	}

	var label = object.labelHTML(name);
	var error = object.error ? '<label class="control-label" style="text-align:left">' + object.error + '</label>' : '';

	var validationclass = object.value && !object.error ? 'has-success' : '';
		validationclass = object.error ? 'has-error' : validationclass;

	var widget = object.widget.toHTML(name, object);
	return '<div class="form-group ' + validationclass + '">' + label + '<div class="col-sm-4">' + widget + '</div>' + error + '</div>';	
}

module.exports.toImageHTML = toImageHTML;
module.exports.bootstrapField = bootstrapField;