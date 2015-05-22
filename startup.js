var fork = require('child_process').fork;

fork('./roomService.js');
fork('./chatService.js');