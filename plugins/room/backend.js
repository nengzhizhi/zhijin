var forms = require('forms');
var async = require('async');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;
var common = require('../common/index.js');
var error = require('./roomError.js');


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
					app.post('/room/update', onUpdate);
				})
			});

	function onCreate(req, res) {
		seneca.createForm = forms.create({
			'name': fields.string({
				required: validators.required('请输入房间名称'),
				errorAfterField: true,
				label: '房间名称：'
			}),
			'type': fields.string({
				label: '房间类型：',
				widget: widgets.select(),
				choices: {
					individual: '个人房间',
					offical : '官方房间'
				}
			}),
			'stream':fields.string({
				label: '码流地址：',
				required: validators.required('请输入码流地址！')
			})			
		});
		
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
					if (seneca.createForm) {
						seneca.createForm.handle(req, {
							success : function (form){
								next(null, form);
							},
							other : function (form){
								next(error.InvalidInput(), form);
							}
						});
					} else {
						next(error.InvalidOperate({operate:'[create room]'}), null);
					}
				}, function (form, next) {
					seneca.act({role:'room',cmd:'create','data':form.data}, function (err, result){
						next(err, result);
					});					
				}
			], function (err, result){
				res.render(
						'admin/room/create',
						{
							result : err?{error:err.message}:{success:'创建成功！'},
							createForm : result.toHTML?result.toHTML(common.bootstrapField):seneca.createForm.toHTML(common.bootstrapField)
						}
					);
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
			},
			episode : function (next) {
				seneca.act({role:'program',cmd:'listEpisode',data:{}}, function (err, result){
					var episodes = {};
					for(var i=0;i<result.length;i++){
						episodes[result[i].id] = result[i].program.name + '-' + result[i].number + '-' +result[i].name;
					}
					episodes[0] = '未选择分期';
					next(err, { episodes : episodes });
				})
			}
		}, function (err, result){
			seneca.editForm = forms.create({
				'name': fields.string({
					required: validators.required('请输入房间名称'),
					errorAfterField: true,
					label: '房间名称：',
					value: result.room.name
				}),
				'type': fields.string({
					label: '房间类型：',
					widget: widgets.select(),
					choices: {
						individual: '个人房间',
						offical : '官方房间'
					},
					value: result.room.type
				}),
				'episode': fields.string({
					label: '选择分期：',
					widget: widgets.select(),
					choices: result.episode.episodes,
					value: result.room.episode ? result.room.episode : 0
				}),
				'stream':fields.string({
					label: '码流地址：',
					required: validators.required('请输入码流地址！'),
					value: result.room.stream
				}),
				'id':fields.string({
					widget: widgets.hidden(),
					value:result.room.id
				})		
			});

			res.render('admin/room/edit', { editForm : seneca.editForm.toHTML(common.bootstrapField) });
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

	function onUpdate(req, res) {
		async.waterfall([
				function (next) {
					if (seneca.editForm) {
						seneca.editForm.handle(req, {
							success : function(form){
								next(null, form);
							},
							other : function(form){
								next(error.InvalidInput(), form);
							}
						});
					} else {
						next(error.InvalidOperate({operate:'[update room]'}), null);
					}
				}, function (form, next) {
					seneca.act({role:'room',cmd:'update',data:form.data}, function (err, entity){
						next(err, entity);
					});
				}
			], function (err, result){
				res.render(
						'admin/room/create',
						{
							result : err ? {error:err.message} : {success:'更新成功！'},
							createForm : result.toHTML ? result.toHTML(common.bootstrapField) : seneca.editForm.toHTML(common.bootstrapField)
						}
					);
			});
	}

	return { name : 'backend' };
}