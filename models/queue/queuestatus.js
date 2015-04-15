var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');

function QueueStatus(statusId, statusName){
	this.statusId = statusId;
	this.statusName = statusName;
}

QueueStatus.getAllStatus = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		return customdefer.request_defered(request, 'proc_getAllQueueStatus');
	}).then(function(data){
		var record = data.recordset[0];
		var arrQueueStatus = [];
		if( record && record.length>0){
			record.forEach(function(record){
				arrQueueStatus.push(new QueueStatus(record.StatusId, record.StatusName));
			});			
		}	
		defered.resolve(arrQueueStatus);
	},function(err){
		defered.reject(err);
	});
	return defered.promise;
}

module.exports = QueueStatus;