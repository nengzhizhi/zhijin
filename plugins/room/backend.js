var forms = require('forms');
var async = require('async');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;
var common = require('../common/index.js');


module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');


	seneca.use('/plugins/room/service');

	seneca.act(
			'role:web', 
			{
				use:router(function (app){
					app.get('/room/create', onCreate);
					app.post('/room/doCreate', onDoCreate);
					app.get('/room/list', onList);
					app.get('/room/detail', onDetail);
					app.get('/room/edit', onEdit);
				})
			});

	seneca.createForm = forms.create({
		name: fields.string({
			required: validators.required('请输入房间名称'),
			errorAfterField: true,
			label: '房间名称：'
		}),
		type: fields.string({
			label: '房间类型：',
			widget: widgets.select(),
			choices: {
				individual: '个人房间',
				offical : '官方房间'
			}
		})
	});

	function onCreate(req, res) {
		res.render(
			'admin/room/create', 
			{
				result:'',
				createForm:seneca.createForm.toHTML(common.bootstrapField)
			}
		);
	}

	function onDoCreate(req, res) {
		async.waterfall([
				function (next) {
					seneca.createForm.handle(req, {
						success : function (form){
							next(null, form);
						},
						other : function (form){
							next("Invalid input", form);
						}
					});
				}, function (form, next) {
					seneca.act({role:'room',cmd:'save','data':form.data}, function (err, result){
						next(err, result);
					});					
				}
			], function (err, result){
				if (err == "Invalid input") {
					res.render(
						'admin/room/create',
						{
							result:{ error : err },
							createForm:result.toHTML(common.bootstrapField)
						}
					);
				} else if(err) {
					res.render(
						'admin/room/create',
						{
							result:{ error : err },
							createForm:seneca.createForm.toHTML(common.bootstrapField)
						}
					);
				} else {
					res.render(
						'admin/room/create',
						{
							result:{'success':'创建成功！'},
							createForm:seneca.createForm.toHTML(common.bootstrapField)
						}
					);					
				}
			});
	}

	function onList(req, res) {
		async.series({
			rooms : function (next) {
				seneca.act({role:'room',cmd:'list',data:{}}, function (err, rooms){
					next(err, rooms);
				})
			}
		}, function (err, result){
			res.render('admin/room/list', { list : result.rooms });
		});
	}

	function onEdit(req, res) {
		async.series({
			room : function (next) {
				seneca.act({role:'room',cmd:'get',data:{id:req.query.id}}, function (err, room){
					next(err, room);
				});
			}
		}, function (err, result){
			seneca.editForm = forms.create({
				name: fields.string({
					required: validators.required('请输入房间名称'),
					errorAfterField: true,
					label: '房间名称：',
					value: result.room.name
				}),
				type: fields.string({
					label: '房间类型：',
					widget: widgets.select(),
					choices: {
						individual: '个人房间',
						offical : '官方房间'
					},
					value: result.room.type
				})
			});

			res.render('admin/room/edit', { editForm:seneca.editForm.toHTML(common.bootstrapField) });
		});
	}

	function onDetail(req, res){
		async.series({
			room : function (next) {
				seneca.act({role:'room',cmd:'get',data:{id:req.query.id}}, function (err, room){
					next(err, room);
				});
			}
		}, function (err, result){
			res.render('admin/room/detail', { 'room':result.room });
		});
	}

	return { name : 'backend' };
}