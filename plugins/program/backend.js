/*
var fs = require('fs');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var async = require('async');
*/

var forms = require('forms');
var async = require('async');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;
var common = require('../common/index.js');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');

	seneca.use('/plugins/prop/service');

	seneca.act(
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
					app.post('/episode/update', onEpisodeUpdate);

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

	function onEpisodeEdit(req, res){
		var episode = {};
		var props = {};
		var selectProps = [];

		async.waterfall([
			function (next){
				seneca.act({role:'program',cmd:'getEpisode',data:{program:req.query.id}}, function (err, result){
					episode = result;
					next(err, null);
				});
			},
			function (result, next) {
				seneca.act({role:'prop', cmd:'list',data:{program:req.query.id}}, function (err, document){
					for (var i = 0; i < document.length; i++) {
						props[document[i].name] = document[i].id;
						if ( episode.props && episode.props.indexOf(document[i].id) >=0 ){
							selectProps.push(document[i].id);
						}
					}
					next(err, null);
				});
			}
		], function (err, result){
			seneca.editForm = forms.create({
				'name': fields.string({
					required: validators.required('请输入分期名称！'),
					label: '分期名称：',
					value: episode.name
				}),
				'number': fields.number({
					required: validators.required('请输入分期编号！'),
					label: '分期编号：',
					value: episode.number
				}),
				'startTime': fields.date({
					required: validators.required('请输入分期开始时间！'),
					label: '开始时间：',
					value: episode.startTime
				}),
				'endTime': fields.date({
					required: validators.required('请输入分期结束时间！'),
					label: '结束时间：',
					value: episode.endTime
				}),
				'actors': fields.string({
					choices: {one: 'Item one', two: 'Item two', three: 'Item three'},
					widget: widgets.multipleCheckbox(),
					label: '本期选手：'
				}),
				'props': fields.string({
					choices: props,
					value: selectProps, 
					widget: widgets.multipleCheckbox(),
					label: '本期道具：'
				}),
				'gifts': fields.string({
					choices: {one: 'Item one', two: 'Item two', three: 'Item three'},
					widget: widgets.multipleCheckbox(),
					label: '本期礼物：'
				}),											
			});

			res.render(
				'admin/episode/edit', 
				{
					result : '', 
					editForm : seneca.editForm.toHTML(common.bootstrapField)
				}
			);
		});
	}

	function onEpisodeDetail(req, res){
		if (!req.query.id) {
			res.render('404');
		}

		var collection = seneca.make$('episode');
		collection.load$({id:req.params.id}, function (err, episode){
			res.render('admin/episode/detail', {result:'', 'episode':episode});
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

	function onEpisodeUpdate(req, res) {
		var episode = seneca.make$('episode');

		if ( req.body.id ){
			episode.id = req.body.id;
		} else {
			res.render('admin/episode/edit',{result:{'error':'分期不存在！'}});
			return;
		}

		if( req.body.prop ){
			episode.props = req.body.prop;
		}

		episode.save$(function (err, episode) {
			if (episode.id) {
				res.render('admin/episode/edit',{result:{'success':'创建成功！'}});
			}
		});
	}

	return { name : 'backend' };
}