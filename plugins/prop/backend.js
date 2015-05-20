var async = require('async');
var forms = require('forms');
var fs = require('fs');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;
var formidable = require('formidable');
var common = require('../common/index.js');

module.exports = function (options) {
	var seneca = this;
	var router = this.export('web/httprouter');

	this.act('role:web', {use:router(function (app){
			app.get('/prop/create', onCreateProp);
			app.get('/prop/list', onPropList);
			app.post('/prop/doCreate', onDoCreateProp);
			app.get('/interaction/list', onInteractionList);
			app.post('/interaction/create', onCreateInteraction);
			app.get('/interaction/start', onStartInteraction);
			app.get('/interaction/stop', onStopInteraction);
		})
	});


	function onCreateProp (req, res) {
		async.waterfall([
				function (next) {
					seneca.act({role:'program',cmd:'listProgram'}, function (err, programs){
						next(err, programs);
					});
				}
			], function (err, result){
				var programs = {};
				for(var i=0;i<result.length;i++){
					programs[result[i].id] = result[i].name;
				}

				seneca.propForm = forms.create({
					'name' : fields.string({
						required : validators.required('请输入道具名称'),
						label : '道具名称：'
					}),
					'logo' : fields.string({
						label : '道具图片：',
						widget : widgets.file(),
						options : {
							buttonId : 'aaa',
							progressId : 'bbb'
						}
					}),
					'type' : fields.string({
						label : '道具类型：',
						widget : widgets.select(),
						choices : {
							privilege : '权限型'
						}
					}),
					'program' : fields.string({
						label : '所属节目：',
						widget : widgets.select(),
						choices : programs
					}),
					'buy' : fields.number({
						label : '倒计时/购买时间：'
					}),
					'endBuy' : fields.number({
						label : '倒计时/购买结果：'
					}),
					'use' : fields.number({
						label : '倒计时/使用时间：'
					}),
					'endUse' : fields.number({
						label : '倒计时/使用结果：'
					})
				});

				res.render(
					'admin/prop/create',
					{
						result : '',
						createForm : seneca.propForm.toHTML(common.bootstrapField)
					}
				)
		});
	}

	function onPropList (req, res) {
		async.waterfall([
			function (next) {
				seneca.act({role:'prop',cmd:'listProp',data:{}}, function (err, props){
					next(err, props);
				})
			}
		], function (err, result){
			res.render('admin/prop/list', {list:result} );
		});
	}

	function onDoCreateProp (req, res) {
		async.waterfall([
				function (next) {
					if (seneca.propForm) {
						seneca.propForm.handle(req, {
							success : function (form) {
								next(null, form);
							},
							other : function (form) {
								next(null, form);
							}
						})
					} else {
						next(null, null);
					}
				}, function (form, next) {
					seneca.act({role:'prop',cmd:'createProp',data:form.data}, function (err, result){
						next(err, result);
					});
				}
			], function (err, result){
				res.render(
						'admin/prop/create',
						{
							result : err ? { error : err.message } : { success : '创建成功！' },
							createForm : result.toHTML ? result.toHTML(common.bootstrapField) : seneca.propForm.toHTML(common.bootstrapField)
						}
					)
			});
	}

	function onInteractionList(req ,res){
		async.waterfall([
			function (next) {
				seneca.act({role:'prop',cmd:'listProp',data:{}}, function (err, result){
					next(err, result);
				});
			}
		], function (err, result){
			res.render('admin/prop/list', {list:result});
		});
	}

	function onCreateInteraction(req, res){
		async.waterfall([
			function (next) {
				seneca.act({
						role:'prop',
						cmd:'createInteraction',
						data:{
							roomId : req.body.roomId,
							propId : req.body.propId
						}
				}, function (err, result){
					next(err, result);
				})
			}, function (result, next) {
				console.log(result);
				seneca.act({
					role:'prop',
					cmd:'startInteraction',
					data:{
						//interactionId:req.query.interactionId
						interactionId : result.id
					}
				}, function (err, result){
					next(err, result);
				});				
			}
		], function (err, result){
			res.redirect('/room/interaction?id=' + req.body.roomId);	
		});
	}

	function onStartInteraction(req, res){
		seneca.act({
				role:'prop',
				cmd:'startInteraction',
				data:{
					interactionId:req.query.interactionId
				}
			}, function (err, result){
				res.redirect('/room/interaction?id=' + req.query.roomId);	
		});
	}

	function onStopInteraction(req, res){
		seneca.act({
				role:'prop',
				cmd:'stopInteraction',
				data:{
					interactionId:req.query.interactionId
				}
			}, function (err, result){
				res.redirect('/room/interaction?id=' + req.query.roomId);	
		});
	}

	return { name : 'backend' };
}