var fs = require('fs');
var formidable = require('formidable');
var bodyParser = require('body-parser');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');

	this.use(
			'mongo-store',
			{name:'zj_program', host:'192.168.1.220', port: 27019}
		);

	this.act(
			'role:web', 
			{
				use:router(function (app){
					app.get('/program/create', onProgramCreate);
					app.get('/program/list', onProgramList);
					app.post('/program/doCreate', onProgramDoCreate);
					app.get('/episode/create', onEpisodeCreate);
					app.get('/episode/list', onEpisodeList);
					app.post('/episode/doCreate', onEpisodeDoCreate);
					app.get('/episode/detail', onEpisodeDetail);
					app.get('/episode/edit', onEpisodeEdit);

				})
			});	

	function onProgramCreate(req, res){
		res.render('admin/program/create', {result:''});
	}

	function onProgramDoCreate(req, res){
		var form = new formidable.IncomingForm();   //创建上传表单
		form.encoding = 'utf-8';        //设置编辑
		form.uploadDir = 'public/upload/';     //设置上传目录
		form.keepExtensions = true;     //保留后缀
		form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

		form.parse(req, function(err, fields, files) {
			if (err) {
				res.render('admin/program/create', {result:{'error':err}});
				return;        
			}

			if(!fields.name){
				res.render('admin/program/create', {result:{'error':'节目名不能为空!'}});
				return;
			}

			if(!fields.description){
				res.render('admin/program/create', {result:{'error':'节目描述不能为空!'}});
				return;				
			}
	       
			var extName = '';  //后缀名
			switch (files.logo.type) {
				case 'image/pjpeg':
					extName = 'jpg';
					break;
				case 'image/jpeg':
					extName = 'jpg';
					break;         
				case 'image/png':
					extName = 'png';
					break;
				case 'image/x-png':
					extName = 'png';
					break;         
			}

			if(extName.length == 0){
				res.render('admin/program/create', {result:{'error':'只支持png和jpg格式图片'}});
				return;                   
			}

			var fileName = Math.random() + '.' + extName;
			var filePath = form.uploadDir + fileName;

			fs.renameSync(files.logo.path, filePath);  //重命名

			var program = seneca.make$('program');
			program.name = fields.name;
			program.description = fields.description;
			program.logoUrl = '/upload/' + fileName;
			program.save$(function (err,program){
				if (program.id) {
					res.render('admin/program/create', {result:{'success':'创建成功！'}});
					return;						
				}
			});
			return;
		});
	}

	function onProgramList(req, res){
		var programs = this.make$('program');
		programs.list$({}, function (err, programs){
			res.render('admin/program/list', {list:programs});
		});
	}

	function onEpisodeCreate(req, res){
		var collection = this.make$('program');
		collection.list$({}, function (err, results){
			res.render('admin/episode/create',{result:'', programs:results});
		});
	}

	function onEpisodeList(req, res){
		var collection = this.make$('episode');
		collection.list$({}, function (err, episodes){
			res.render('admin/episode/list', {list:episodes});
		});
	}

	function onEpisodeDetail(req, res){
		if (!req.query.id) {
			res.render('404');
		}

		var collection = this.make$('episode');
		collection.list$({id:req.params.id}, function (err, episodes){
			res.render('admin/episode/detail', {result:'', episode:episodes[0]});
		});
	}

	function onEpisodeEdit(req, res){
		if (!req.query.id) {
			res.render('404');
		}

		var collection = this.make$('episode');
		collection.list$({id:req.params.id}, function (err, episodes){
			res.render('admin/episode/edit', {result:'', episode:episodes[0]});
		});		
	}

	function onEpisodeDoCreate(req, res){
		var seneca = this;
		if (!req.body.name) {
			res.render('admin/episode/create', {result:{'error':'分期名不能为空!'}});
			return;			
		}

		if (!req.body.number) {
			res.render('admin/episode/create', {result:{'error':'分期编号不能为空!'}});
			return;			
		}

		if (!req.body.startTime) {
			res.render('admin/episode/create', {result:{'error':'开始时间不能为空!'}});
			return;			
		}

		if (!req.body.endTime) {
			res.render('admin/episode/create', {result:{'error':'结束时间不能为空!'}});
			return;			
		}

		var episode = seneca.make$('episode');
		episode.name = req.body.name;
		episode.number = req.body.number;
		episode.program = req.body.program;
		episode.startTime = req.body.startTime;
		episode.endTime = req.body.endTime;
		episode.save$(function (err, episode){
			if (episode.id) {
				var collection = seneca.make$('program');
				collection.list$({}, function (errors, results){
					res.render('admin/episode/create',{result:{'success':'创建成功！'}, programs:results});
					return;
				});						
			}		
		});
		return;
	}

	return { name : 'backend' };
}