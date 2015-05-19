var Q = require('q');

var ioex = function(io){
	io.on('connection',function(socket){
		console.log('a user connect');
		socket.on('disconnect', function(){
			console.log('user disconnected.');
		});
	});	
};

module.exports = ioex;