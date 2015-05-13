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
	seneca.use('/plugins/program/service');

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
		seneca.programForm = forms.create({
			'name': fields.string({
				required: validators.required('请输入节目名称！'),
				errorAfterField: true,
				label: '节目名称：'				
			}),
			'logo': fields.string({
				widget: widgets.file(),
				required: validators.required('请上传节目logo！'),
				label: '节目图片：'
			}),
			'description': fields.string({
				label: '节目描述：',
				widget: widgets.textarea()
			})
		});

		res.render(
			'admin/program/create', 
			{
				result : {},
				form : seneca.programForm.toHTML(common.bootstrapField)
			}
		);
	}

	function onProgramDoCreate(req, res){
		async.waterfall([
				function (next) {
					if (seneca.programForm) {
						seneca.programForm.handle(req,{
							success: function (form){
								next(null, form);
							},
							other: function (form){
								//FIXME
								next("Invalid input", form);
							}
						})
					} else {
						next("Invalid input", null);
					}
			}, function (form, next) {
				seneca.act({role:'program',cmd:'createProgram',data:form.data}, function (err, result){
					next(err, result);
				})
			}], function (err, result){
				if ( err == "Invalid input") {
					res.render(
						'admin/program/create', 
						{ 
							result:{ error:err }, 
							form:result.toHTML(common.bootstrapField)
						}
					);				
				} else if (err) {
					res.render(
						'admin/program/create', 
						{ 
							result:{ error:err }, 
							form:seneca.createForm.toHTML(common.bootstrapField)
						}
					);							
				} else {
					res.render(
						'admin/program/create', 
						{ 
							result:{'success':'创建成功！'}, 
							form:seneca.createForm.toHTML(common.bootstrapField)
						}
					);				
				}
			});
	}

	function onProgramList(req, res){
		async.waterfall([
			function (next) {
				seneca.act({role:'program',cmd:'listProgram',data:{}}, function (err, programs){
					next(err, programs);
				})
			}
		], function (err, result){
			res.render('admin/program/list', {list:result});
		})
	}

	function onEpisodeCreate(req, res){
		async.waterfall([
				function (next) {
					seneca.act({role:'program',cmd:'listProgram',data:{}}, function (err, programs){
						next(err, programs);
					})
				}
			], function (err, result){
				var programs = {};
				for(var i=0;i<result.length;i++){
					programs[result[i].id] = result[i].name;
				};

				seneca.episodeForm = forms.create({
					'name': fields.string({
						required: validators.required('请输入分期名称！'),
						errorAfterField: true,
						label: '分期名称：'				
					}),
					'number': fields.string({
						required: validators.required('请输入分期编号！'),
						errorAfterField: true,
						label: '分期编号：'					
					}),
					'program': fields.string({
						label: '所属节目：',
						widget: widgets.select(),
						choices: programs				
					}),
					'startTime': fields.date({
						label: '开始时间：',
						required: validators.required('请输入正确的开始时间！')
					}),
					'endTime': fields.date({
						label: '结束时间：',
						required: validators.required('请输入正确的结束时间！')
					})
				});

				res.render(
					'admin/episode/create',
					{
						result : {},
						form : seneca.episodeForm.toHTML(common.bootstrapField)
					}
				);				
			}
		);
	}

	function onEpisodeList(req, res){
		var collection = this.make$('episode');
		collection.list$({}, function (err, episodes){
			res.render('admin/episode/list', {list:episodes});
		});
	}

	function onEpisodeEdit(req, res){
		var programId;
		var episode;

		async.series({
			episode : function(next){
				seneca.act({role:'program',cmd:'getEpisode',data:{id:req.query.id}}, function (err,result){
					programId = result.program.id;
					episode = result;
					next(err, result);
				});
			},
			prop : function(next){
				seneca.act({role:'prop',cmd:'listProp',data:{program:programId}}, function (err,result){
					var props = {};
					var selectProps = [];
					for (var i=0;i<result.length;i++) {
						props[result[i].id] = result[i].name;
						if (episode.props && episode.props.indexOf(result[i].id) >= 0) {
							selectProps.push(result[i].id);
						}
					}
					next(err, {props:props, selectProps:selectProps});
				})
			},
			actor : function(next){
				seneca.act({role:'actor',cmd:'list',data:{program:programId}}, function (err, result){
					var actors = {};
					var selectActors = [];
					for (var i=0;i<result.length;i++) {
						actors[result[i].id] = result[i].name;
						if (episode.actors && episode.actors.indexOf(result[i].id) >= 0) {
							selectActors.push(result[i].id);
						}
					}
					next(err, {actors:actors, selectActors:selectActors});
				});
			} 
		}, function (err, result){
			seneca.episodeEditForm = forms.create({
				'name': fields.string({
					required: validators.required('请输入分期名称！'),
					label: '分期名称：',
					value: result.episode.name
				}),
				'number': fields.string({
					required: validators.required('请输入正确分期编号！'),
					label: '分期编号：',
					value: result.episode.number
				}),
				'startTime': fields.date({
					required: validators.required('请输入分期开始时间！'),
					label: '开始时间：',
					value: result.episode.startTime
				}),
				'endTime': fields.date({
					required: validators.required('请输入分期结束时间！'),
					label: '结束时间：',
					value: result.episode.endTime
				}),				
				'actors': fields.array({
					choices: result.actor.actors,
					value: result.actor.selectActors,
					widget: widgets.multipleCheckbox(),
					label: '本期选手：'
				}),
				'props': fields.array({
					choices: result.prop.props,
					value: result.prop.selectProps, 
					widget: widgets.multipleCheckbox(),
					label: '本期道具：'
				}),
				'id': fields.string({
					widget: widgets.hidden(),
					value: result.episode.id
				})				
			});

			res.render(
				'admin/episode/edit', 
				{
					result : '', 
					editForm : seneca.episodeEditForm.toHTML(common.bootstrapField)
				}
			);			
		})
	}

	function onEpisodeDetail(req, res){
		async.series([
			function (next){
				seneca.act({role:'program',cmd:'getEpisode',data:{id:req.query.id}}, function (err, episode){
					next(err, episode);
				});
			}	
		], function (err, result){
			res.render('admin/episode/detail', {result:{},episode:result[0]});
		});		
	}

	function onEpisodeDoCreate(req, res){
		async.waterfall([
				function (next) {
					if (seneca.episodeForm) {
						seneca.episodeForm.handle(req, {
							success: function (form){
								next(null, form);
							},
							other: function (form){
								//FIXME
								next("Invalid input", form);
							}
						});
					}
				}, function (form, next) {
					seneca.act({role:'program',cmd:'getProgram',data:{id:form.data.program}}, function (err, result){
						form.data.program = result;
						next(err, form);
					});
				}, function (form, next) {
					seneca.act({role:'program',cmd:'createEpisode',data:form.data}, function (err, result){
						next(err, result);
					});
				}
			], function (err, result){
				if ( err == "Invalid input") {
					res.render(
						'admin/episode/create', 
						{ 
							result:{ error:err }, 
							form:result.toHTML(common.bootstrapField)
						}
					);				
				} else if (err) {
					res.render(
						'admin/episode/create', 
						{ 
							result:{ error:err }, 
							form:seneca.episodeForm.toHTML(common.bootstrapField)
						}
					);							
				} else {
					res.render(
						'admin/episode/create', 
						{ 
							result:{'success':'创建成功！'}, 
							form:seneca.episodeForm.toHTML(common.bootstrapField)
						}
					);				
				}				
			})
	}

	function onEpisodeUpdate(req, res) {
		async.waterfall([
			function (next){
				if (seneca.episodeEditForm) {
					seneca.episodeEditForm.handle(req, {
						success : function(form){
							next(null, form);
						},
						other : function(form){
							next("Invalid input", form);
						}
					});
				} else {
					next("Invalid input1", null);
				}
			},
			function (form, next) {
				seneca.act({role:'program',cmd:'updateEpisode', data:form.data}, function (err, entity){
					next(err, entity);
				});
			}
		], function (err, result){
			if ( err == "Invalid input") {
				res.render(
					'admin/episode/edit', 
					{ 
						result:{ error:err }, 
						editForm:result.toHTML(common.bootstrapField)
					}
				);				
			} else if (err) {
				res.render(
					'admin/episode/edit', 
					{ 
						result:{ error:err }, 
						editForm:seneca.episodeEditForm.toHTML(common.bootstrapField)
					}
				);							
			} else {
				res.render(
					'admin/episode/edit', 
					{ 
						result:{'success':'创建成功！'}, 
						editForm:seneca.episodeEditForm.toHTML(common.bootstrapField)
					}
				);				
			}
		});
	}

	return { name : 'backend' };
}