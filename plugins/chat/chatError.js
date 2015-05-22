var eraro = require('eraro')({package:'chat'});

function chatError() {
	this.InvalidParam = function(detail) {
		return eraro('InvalidParam', 'Invalid param:<%=operate %>', detail);
	}

	return this;
}

module.exports = chatError;