var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var programModel = require('../program/model.js').programModel;

var propSchema = new Schema({
	name : String,
	type : String,
	program : {
		type	: Schema.Types.ObjectId,
		ref : 'program'
	},
	countdown : Schema.Types.Mixed,
	menu :Schema.Types.Mixed
});

exports.propModel = mongoose.model('prop', propSchema);