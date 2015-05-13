var forms = require('forms');
var async = require('async');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;
var common = require('../common/index.js');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');

	seneca.use('/plugins/actor/service');
	seneca.use('/plugins/program/service');

	seneca.act('role:web', {use:router(function (app){
		app.get('/actor/create', onCreate);
		app.post('/actor/doCreate', onDoCreate);
		app.get('/actor/list', onList);
		app.get('/actor/delete', onDelete);
	})});

	function onCreate(req, res){
		async.waterfall([function (next){
			seneca.act({role:'program',cmd:'listProgram',data:{}}, function (err, programs){
				next(err, programs);
			});
		}], function (err, result){
			var programs = {};
			for(var i=0;i<result.length;i++){
				programs[result[i].id] = result[i].name;
			};

			seneca.createForm = forms.create({
				'name': fields.string({
					required: validators.required('请输入选手姓名！'),
					errorAfterField: true,
					label: '选手姓名：'
				}),
				'program': fields.string({
					choices: programs,
					widget: widgets.select(),
					label: '所属节目：'
				}),
				'avatar': fields.string({
					widget: widgets.file(),
					required: validators.required('请上传选手图片！'),
					label: '选手图片：'
				})
			});

			res.render(
				'admin/actor/create', 
				{
					result: {},				 
					form:seneca.createForm.toHTML(common.bootstrapField)
				}
			);			
		})
	}

	function onDoCreate(req, res){
		async.waterfall([
			function (next){
				if (seneca.createForm) {
					seneca.createForm.handle(req,{
						success: function (form){
							next(null, form);
						},
						other: function (form){
							//FIXME
							next("Invalid input", form);
						}
					});
				} else {
					next("Invalid input", null);
				}
		}, function (form, next){
			seneca.act({role:'actor', cmd:'create', data:form.data}, function (err, result){
				next(err, result);
			});
		}], function (err, result){
			if ( err == "Invalid input") {
				res.render(
					'admin/actor/create', 
					{ 
						result:{ error:err }, 
						form:result.toHTML(common.bootstrapField)
					}
				);				
			} else if (err) {
				res.render(
					'admin/actor/create', 
					{ 
						result:{ error:err }, 
						form:seneca.createForm.toHTML(common.bootstrapField)
					}
				);							
			} else {
				res.render(
					'admin/actor/create', 
					{ 
						result:{'success':'创建成功！'}, 
						form:seneca.createForm.toHTML(common.bootstrapField)
					}
				);				
			}
		});
	}

	function onList(req, res){
		async.waterfall([function (next){
			seneca.act({role:'actor', cmd:'list', data: {}}, function (err, result){
					next(err, result);
				});
		}], function (err, result){
			if (err) {
				res.render('404');
			} else {
				res.render('admin/actor/list', {list:result});
			}
		});
	}

	function onDelete(req, res){
		async.waterfall([function (next){
			seneca.act({role:'actor', cmd:'delete', data:{id:req.query.id}}, function (err, result){
				next(err, result);
			});
		}], function (err, result){
			if (err) {
				res.render('404');
			} else {
				res.render(
					'admin/actor/list', 
					{
						list:result
					});
			}			
		});
	}
}