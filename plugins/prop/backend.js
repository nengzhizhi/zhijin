var fs = require('fs');
var formidable = require('formidable');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');

	this.act('role:web', {use:router(function (app){
			app.get('/prop/create', onCreateProp);
			app.post('/prop/doCreate', onDoCreateProp);
			app.get('/interaction/list', onInteractionList);
		})
	});


	function onCreateProp(req, res) {
		res.render('admin/prop/create', {result:''});
	}

	function onDoCreateProp(req, res){
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8';        //设置编辑
		form.keepExtensions = true;     //保留后缀
		form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
		form.uploadDir = 'public/upload/';

		form.parse(req, function (err, fields, files) {
			if (err) {
				res.render('admin/prop/create', {result:{'error':err}});
				return;				
			}

			//TODO 所有图片仅支持png格式
			var imgUrl = form.uploadDir + Math.random() + '.png';
			fs.renameSync(files.img.path, imgUrl); 

			var prop = seneca.make$('prop');
			prop.name = fields.name;
			prop.imgUrl = imgUrl;
			prop.type = fields.type;
			prop.voteStage = [];
			if(files.icon_1.size && fields.number_1){
				var stage_1 = {
					number : fields.number_1,
					icon : form.uploadDir + Math.random() + '.png'
				}
				fs.renameSync(files.icon_1.path, stage_1.icon);
				prop.voteStage.push(stage_1);
			}
			if(files.icon_2.size && fields.number_2){
				var stage_2 = {
					number : fields.number_2,
					icon : form.uploadDir + Math.random() + '.png'
				}
				fs.renameSync(files.icon_2.path, stage_2.icon);
				prop.voteStage.push(stage_2);
			}

			if(files.icon_3.size && fields.number_3){
				var stage_3 = {
					number : fields.number_3,
					icon : form.uploadDir + Math.random() + '.png'
				}
				fs.renameSync(files.icon_3.path, stage_3.icon);
				prop.voteStage.push(stage_3);
			}
			prop.save$(function (err, prop){
				if (prop.id) {
					res.render('admin/prop/create', {result:{'success':'创建成功！'}});
					return;						
				}
			});
			return;		
		});
	}

	function onInteractionList(req ,res){
		var collection = this.make$('interaction');
		collection.list$({}, function (err, interactions){
			res.render('admin/interaction/list', {list:interactions});
		})
	}

	return { name : 'backend' };
}