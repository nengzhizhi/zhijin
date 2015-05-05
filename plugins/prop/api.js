module.exports = function (options) {
	var router = this.export('web/httprouter');

	this.act('role:web',{use:router(function (app){
		app.post('/api/prop/start', onStartProp);
		app.post('/api/prop/buy'  , onBuyProp);
		app.post('/api/prop/use'  , onUseProp);
	})});	

	this.use('/plugins/chat/service');

	function onStartProp(req, res) {
		//执行阶段一
		setTimeout(function (){
			this.act({role:'chat',cmd:'broadcast'}, function (err, result){

			});
		}, 1000);
	}

	function onBuyProp(req, res) {
		//获取道具信息
		//查询用户余额
		//扣除余额
		//记录购买结果
		//购买成功
	}
}