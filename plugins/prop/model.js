var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var programModel = require('../program/model.js').programModel;
var roomModel = require('../room/model.js').roomModel;
var actorModel = require('../actor/model.js').actorModel;

var propSchema = new Schema({
	name : String,
	type : String,
	program : {
		type	: Schema.Types.ObjectId,
		ref : 'program'
	},
	countdown : {
		buy : Number,
		endBuy : Number,
		use : Number,
		endUse : Number
	},
	menu : {
		options : []
	}
});

var interactionSchema = new Schema({
	prop : {
		type : Schema.Types.ObjectId,
		ref : 'prop'
	},
	room : {
		type : Schema.Types.ObjectId,
		ref : 'room'
	},
	countdown : {
		buy : Number,
		endBuy : Number,
		use : Number,
		endUse : Number
	},
	status : Boolean,
	actors : [{
		type: Schema.Types.ObjectId,
		ref : 'actor'
	}],
	result : {}
});

exports.propModel = mongoose.model('prop', propSchema);
exports.interactionModel = mongoose.model('interaction', interactionSchema);