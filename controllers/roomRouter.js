var express = require('express');
var roomRouter = express.Router();

roomRouter.get('/', function (req, res) {
	//res.render('/app/room');
	res.send('Hello from APIv1 root route1111.');
});

roomRouter.get('/show', function (req, res) {
	res.render('app/room/show');
});

module.exports = roomRouter;