var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var actorModel = require('../actor/model.js').actorModel;
var propModel = require('../prop/model.js').propModel;

var programSchema = new Schema({
	name : String,
	description : String,
	logo : String
});

var episodeSchema = new Schema({
	actors	: [{ 
		type : Schema.Types.ObjectId,
		ref  : 'actor'
	}],
	startTime	: String,
	endTime		: String,
	name		: String,
	number		: String,
	program		: {
		type : Schema.Types.ObjectId,
		ref  : 'program'
	},
	props	: [{
		type : Schema.Types.ObjectId,
		ref  : 'prop'
	}]
});

exports.programModel = mongoose.model('program', programSchema);
exports.episodeModel = mongoose.model('episode', episodeSchema);
