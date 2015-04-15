var sql = require('mssql');
var customdefer = require('../customdefer');
var Queue = require('./queue');
var Person = require('./person');
var Q = require('q');

function Ticket(option){
    this.queueId = option.queueId || null;
    this.seqVersion = option.seqVersion || null;
    this.seqId = option.seqId || '';
    this.priority = option.priority || 1;
    this.inQueueTime = option.inQueueTime;
    this.lastCallTime = option.lastCallTime;
    this.outQueueTime = option.outQueueTime;
    this.status = option.status;
    this.callTimes = option.callTimes;
    this.callerId = option.callerId;
    this.personId = option.personId;
    this.uniSeqId =  option.uniSeqId;
    this.queue = option.queue || null;
    this.person = option.person || null;
}
Ticket.getQueuingTicketByQueueId = function(queueId){
	var config = require('../connconfig').queue;
	var conn = new sql.Connection(config);
	var defered = Q.defer();
	customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('QueueId', sql.Int, queueId);
		return customdefer.request_defered(request, 'proc_getQueuingPersonByQueueId');
	}).then(function(data){
		var record = data.recordset[0];
		var tickets = [];
		if( record && record.length>0){
			
			record.forEach(function(row){
				var ticket = new Ticket({
					'queueId' : row.QueueId,
					'seqVersion' : row.SeqVersion,
					'seqId' : row.SeqId,
					'priority' : row.Priority,
					'inQueueTime' : row.InQueueTime,
					'lastCallTime' : row.LastCallTime,
					'outQueueTime' : row.OutQueueTime,
					'status' : row.Status,
					'callTimes' : row.CallTimes,
					'callerId' : row.CallerId,
					'personId' : row.PersonId,
					'uniSeqId' : row.UniSeqId
				});
				tickets.push(ticket);
			});
			
		}
		defered.resolve(tickets);
	},function(err){
		console.log("executing proc_getQueuingPersonByQueueId Error: " + err.message);
		defered.reject(err);
	});
	return defered.promise;
};

//Ticket.prototype.pushPersonEnqueue = function(queueId, personId){
Ticket.create = function(queue, person){
	var ticket = null;
	if(person){
		ticket = new Ticket({'queue':queue, 'person':person});
	}else{
		ticket = new Ticket({'queue':queue});
	}
	var config = require('../connconfig').queue;
	var conn = new sql.Connection(config);
	var defered = Q.defer();
	customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('QueueId', sql.Int, queue.id);
		request.input('PersonId', sql.Int, person?person.personId:null);
		return customdefer.request_defered(request, 'proc_enqueue');
	}).then(function(data){
		if(data.ret !== 0){
			return defered.reject(new Error(data.recordset[0][0].errmsg));
		}
		var record = data.recordset[0];
		if( record && record.length>0){
			ticket.seqVersion = record[0].SeqVersion;
			ticket.seqId = record[0].SeqId;
			ticket.uniSeqId=record[0].UniSeqId;
			defered.resolve(ticket);
		}else{
			defered.reject(new Error('enqueue failed.'));
		}
	},function(err){
		console.log("executing proc_enqueue Error: " + err.message);
		defered.reject(err);
	});
	return defered.promise;
};

//Ticket.prototype.update = function(){
//	var that = this;
//	var config = require('../connconfig').queue;	
//	var conn = new sql.Connection(config);
//	var defered = Q.defer();
//	customdefer.conn_defered(conn).then(function(conn){
//		var request = new sql.Request(conn);
//		request.input('QueueId', sql.Int, queue.id);
//		request.input('PersonId', sql.Int, person?person.personId:null);
//		return customdefer.request_defered(request, 'proc_enqueue');
//	}).then(function(data){
//		if(data.ret !== 0){
//			return defered.reject(new Error(data.recordset[0][0].errmsg));
//		}
//		var record = data.recordset[0];
//		if( record && record.length>0){
//			ticket.seqVersion = record[0].SeqVersion;
//			ticket.seqId = record[0].SeqId;
//			ticket.uniSeqId=record[0].UniSeqId;
//			defered.resolve(ticket);
//		}else{
//			defered.reject(new Error('enqueue failed.'));
//		}
//	},function(err){
//		console.log("executing proc_enqueue Error: " + err.message);
//		defered.reject(err);
//	});
//	return defered.promise;
//}

module.exports = Ticket;