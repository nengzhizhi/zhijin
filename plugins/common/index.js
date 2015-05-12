var formidable = require('formidable');
var fs = require('fs');
var fileUpload = require('./fileUpload.js');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');

	seneca.add({role:'common',cmd:'init'},	cmd_init);

	function cmd_init(args, callback){
		seneca.uploadServe = fileUpload.build(args.data.uploadPort);
		callback(null, null);
	}

	seneca.act({role:'common',cmd:'init',data:{uploadPort:8888}}, function (err, uploadServe){
		console.log("Upload serve start on port 8888!");
	});

	/*
	//图片上传公共接口，返回图片地址
	seneca.act('role:web', {use:router(function (app){
		app.post('/common/upload', onUpload);
	})});

	function onUpload(req, res) {
		var form = new formidable.IncomingForm();
		form.uploadDir = 'public/upload/temp/';

		form.parse(req, function (err, fields, files){
			console.log(fields);
			console.log(JSON.stringify(files));
			for (var key in files) {
				console.log(key);
				console.log(files[key]);
				var file = files[key];
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
					if (err) {
						res.write(JSON.stringify({'err' : err}));
						res.end();						
					}
					res.write(uploadDir);
					res.end();
				});
			}
		});
	}
	*/
}

function toImageHTML(labelText, id) {
	var html = 
	'<div class="form-group">' +
		'<label for="id_name" class="control-label col-sm-2">' + labelText + '</label>' +
		'<div class="col-sm-4">' +
		'<input id="' + id + '" type="file" class="form-control">' +
		'</div>' +
		'<a href="#" class="btn btn-default" onClick="upload(\'' + id + '\' , \'' + id + 'Url\')" style="float:left">上传</a>' +
		'<input type="hidden" id="' + id + 'Url">' +
	'</div>';
	return html;
}

function bootstrapField(name, object) {
	object.widget.classes = object.widget.classes || [];
	object.cssClasses = object.cssClasses || {label: ['control-label','col-sm-2']};
	if(object.widget.classes.indexOf('form-control') < 0 && object.widget.type != 'multipleCheckbox'){
		object.widget.classes.push('form-control');
	}

	var label = object.labelHTML(name);
	var error = object.error ? '<label class="control-label" style="float:left">' + object.error + '</label>' : '';

	var validationclass = '';
	validationclass = object.error ? 'has-error' : validationclass;

	var widget = object.widget.toHTML(name, object);

	if(object.widget.type == 'multipleCheckbox'){
		var html = 
				'<div class="form-group ' + validationclass + '">' + label + 
				'<div class="col-sm-6"><a href="#' + name + '" class="btn btn-primary" data-toggle="collapse" aria-expanded="false" aria-controls="' + name + '">选择</a>' +
				'<div class="collapse" id="' + name + '" aria-expanded="false"><div class="well">' +
				widget +
				'</div></div></div></div>';
		return html;
	} else {
		return '<div class="form-group ' + validationclass + '">' + label + '<div class="col-sm-4">' + widget + '</div>' + error + '</div>';	
	}
}

module.exports.toImageHTML = toImageHTML;
module.exports.bootstrapField = bootstrapField;