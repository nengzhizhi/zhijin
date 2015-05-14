var eraro = require('eraro')({package:'room'});

function roomError() {
	this.InvalidInput 	= function(detail){
		return eraro('InvalidInput', 'Invalid input!', detail);
	}
	this.RoomNotExist	= function(detail){
		return eraro('RoomNotExist', 'Room : <%=roomId%> dose not exist!', detail);
	}

	return this;
}

module.exports = roomError;