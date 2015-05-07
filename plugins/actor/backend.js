var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;

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

	seneca.act('role:web', {use:router(function (app){
		app.get('/actor/create', onCreate);
		app.post('/actor/doCreate', onDoCreate);
	})});

	function onCreate(req, res){
		res.render('admin/actor/create', { result:'', form:seneca.createForm.toHTML(bootstrapField) });
	}

	function onDoCreate(req, res){
		seneca.createForm.handle(req, {
			success: function (form) {
				console.log('form.data:' + form.data);
				res.render('admin/actor/create', {result:{success:'创建成功！'}});
			},
			other : function (form){
				console.log('form.data:' + form.data);
				res.render('admin/actor/create', { result:'', 'form':form.toHTML(bootstrapField) });
			}
		});
	}


	var bootstrapField = function (name, object) {
		object.widget.classes = object.widget.classes || [];
		if(object.widget.classes.indexOf('form-control') < 0){
			object.widget.classes.push('form-control');
		}

		var label = object.labelHTML(name);
		var error = object.error ? '<label class="control-label" style="text-align:left">' + object.error + '</label>' : '';

		var validationclass = object.value && !object.error ? 'has-success' : '';
			validationclass = object.error ? 'has-error' : validationclass;

		var widget = object.widget.toHTML(name, object);
		return '<div class="form-group ' + validationclass + '">' + label + '<div class="col-sm-4">' + widget + '</div>' + error + '</div>';	
	}
}