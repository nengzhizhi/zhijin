var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;
var common = require('../common/index.js');
var async = require('async');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');
	seneca.createForm = forms.create({
				'name': fields.string({
					required: validators.required('请输入选手姓名！'),
					errorAfterField: true,
					cssClasses: {label: ['control-label','col-sm-2']},
					label: '选手姓名：'
				}),
				'program': fields.string({
					choices: {
						one: 'option one',
						two: 'option two',
						three: 'option three'
					},
					widget: widgets.select(),
					cssClasses: {label: ['control-label','col-sm-2']},
					label: '所属节目：'
				})
			});

	seneca.use('/plugins/actor/service');

	seneca.act('role:web', {use:router(function (app){
		app.get('/actor/create', onCreate);
		app.post('/actor/doCreate', onDoCreate);
	})});

	function onCreate(req, res){
		res.render(
					'admin/actor/create', 
					{ 
						result:'', 
						form:seneca.createForm.toHTML(common.bootstrapField), 
						actorImg:common.toImageHTML('选手图片：', 'img') 
					}
				);
	}

	function onDoCreate(req, res){
		async.waterfall([
			function (next){
				seneca.createForm.handle(req,{
					success: function (form){
						next(null, form.data);
					},
					other: function (form){
						//FIXME
						next(null, form.data);
					}
				});
		}, function (data, next){
			seneca.act({role:'actor',cmd:'create',data:'data'}, function (err, result){
				next(err, result);
			});
		}], function (err, result){
			if (err) {
				res.render(
					'admin/actor/create', 
					{ 
						result:{error:err}, 
						form:seneca.createForm.toHTML(common.bootstrapField), 
						actorImg:common.toImageHTML('选手图片：', 'img') 
					}
				);				
			} else {
				res.render(
					'admin/actor/create', 
					{ 
						result:{'success':'上传成功！'}, 
						form:seneca.createForm.toHTML(common.bootstrapField), 
						actorImg:common.toImageHTML('选手图片：', 'img') 
					}
				);				
			}
		});

		/*
		seneca.createForm.handle(req, {
			success: function (form) {

				seneca.act({role:'actor',cmd:'create',data:form.body}, function);

				res.render(
					'admin/actor/create', 
					{ 
						result:{'success':'上传成功！'}, 
						form:seneca.createForm.toHTML(bootstrapField), 
						actorImg:common.toImageHTML('选手图片：', 'img') 
					}
				);
			},
			other : function (form){
				console.log('form.data:' + form.data);
				res.render(
					'admin/actor/create', 
					{ 
						result:'', 
						form:seneca.createForm.toHTML(bootstrapField), 
						actorImg:common.toImageHTML('选手图片：', 'img') 
					}
				);
			}
		});
		*/
	}
}