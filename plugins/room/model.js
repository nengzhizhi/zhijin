var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var episodeModel = require('../program/model.js').episodeModel;

var roomSchema = new Schema({
	name	: String,
	status	: String,
	stream	: String,
	type	: String,
	episode	: {
		type	: Schema.Types.ObjectId,
		ref		: 'episode'
	}
});

exports.roomModel = mongoose.model('room', roomSchema);

