var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var programModel = require('../program/model.js').programModel;

var actorSchema = new Schema({
	name	: String,
	avatar	: String,
	program	: {
		type : Schema.Types.ObjectId,
		ref  : 'program'
	}
});

exports.actorModel = mongoose.model('actor', actorSchema);