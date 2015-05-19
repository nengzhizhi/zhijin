var eraro = require('eraro')({package:'program'});

function programError() {
	this.InvalidInput 	= function(detail){
		return eraro('InvalidInput', 'Invalid input!', detail);
	}
	this.InvalidOperate = function(detail){
		return eraro('InvalidOperate', 'Invalid operate : <%=operate %>', detail);
	}

	return this;
}

module.exports = programError;