var QueueClass = require('../models/queue/queueclass'); 
var Queue = require('../models/queue/queue'); 
var Person = require('../models/queue/person'); 
var Q = require('q');

var ioex = function(io){
	io.on('connection',function(socket){
		console.log('a user connect');
		socket.emit('news', {hello:'world'});
		socket.on('join-room', function(roominfo, fn){
			socket.rooms.forEach(function(val){
				console.log('leaveing:'+val);
				socket.leave(val);
			});
			for(var room in roominfo.data){
				socket.join(roominfo.roomtype+':'+room);
			}
			fn({code:0, message:'join room:'+socket.rooms});
		});
		//叫号
		socket.on('fetch-ticket', function(data, fn){
			var queueId = data.queueId;
			var externalPersonId = data.externalPersonId || '';
			var queue = new Queue();
			queue.init(queueId)
				.then(function(queue){
					return queue.enqueue(externalPersonId);
				})
				.then(function(pq){
					socket.emit('fetch-ticket-result', {code:0,message:'', data:pq});
				},function(err){
					socket.emit('fetch-ticket-result',
							{code:1, message:'取号失败，原因：'+err.message, data:null});
				});	
			 
		});
		socket.on('disconnect', function(){
			console.log('user disconnected.');
		});
	});	
};

module.exports = ioex;