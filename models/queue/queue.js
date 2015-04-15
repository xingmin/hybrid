var sql = require('mssql'); 
var customdefer = require('../customdefer');
var Person = require('./person'); 
var Ticket = require('./ticket'); 
var QueueClass = require('./queueclass'); 
var ExternalSys = require('./externalsys'); 
var Q = require('q');

function Queue(id,name,maxCallTimes, queueClassId,queueClassName,isActive){
    this.id = id;
    this.name = name;
    this.maxCallTimes = maxCallTimes;
    this.queueClassId = queueClassId; 
    this.queueClassName = queueClassName; 
    this.isActive = isActive; 
};

Queue.prototype.init = function(queueId){
	this.id = queueId;
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);		
		return customdefer.request_defered(request, 'proc_getQueueById');
	}).then(function(data){
		var record = data.recordset[0];
		if( record && record.length>0){
			that.id = record[0].QueueId;
			that.name = record[0].QueueName;
			that.maxCallTimes = record[0].MaxCallTimes;
			that.queueClassId = record[0].QueueClassId; 
			that.queueClassName = record[0].QueueClassName; 
			that.isActive = record[0].IsActive; 
		}	
		defered.resolve(that);
	},function(err){
		defered.reject(err);
	});
	return defered.promise;
};

Queue.prototype.getAllQueues = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		return customdefer.request_defered(request, 'proc_getQueueList');
	}).then(function(data){
		var arrQueue = [];
		data.recordset[0].forEach(function(value){
			arrQueue.push((new Queue( value.QueueId,
					value.QueueName,
					value.MaxCallTimes,
					value.QueueClassId,
					value.QueueClassName,
					value.IsActive)));
		});
		return arrQueue;
	},function(err){
		if (err) {
			console.log("executing proc_getQueueList Error: " + err.message);
			return err;
		}
	});
	return promise;
};


Queue.prototype.createNewQueue = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('name', sql.NVarChar(100), that.name);	
		request.input('maxCallTimes', sql.Int, that.maxCallTimes);
		request.input('queueClassId', sql.Int, that.queueClassId);
		request.input('isActive', sql.Int, that.isActive);
		return customdefer.request_defered(request, 'proc_addQueue');
	}).then(function(data){
		that.id = data.recordset[0][0].QueueId;
		return that;
	},function(err){
		if (err) {
			console.log("executing proc_addQueue Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Queue.prototype.updateQueue = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);	
		request.input('name', sql.NVarChar(100), that.name);
		request.input('maxCallTimes', sql.Int, that.maxCallTimes);
		request.input('queueClassId', sql.Int, that.queueClassId);
		request.input('isActive', sql.Int, that.isActive);
		return customdefer.request_defered(request, 'proc_updateQueue');
	}).then(function(data){
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_updateQueue Error: " + err.message);
			return err;
		}
	});
	return promise;
};

Queue.prototype.deleteQueue = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);		
		return customdefer.request_defered(request, 'proc_deleteQueue');
	}).then(function(data){
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_deleteQueue Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Queue.getUserAvilableQueueDetail = function(userid){
	var config = require('../connconfig').queue;
	var defered = Q.defer();
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('userid', sql.Int, userid);	
		return customdefer.request_defered(request, 'proc_getUserAvilableQueueDetail');
	}).then(function(data){
		var arrQueue = [];
		data.recordset[0].forEach(function(value){
			arrQueue.push(new Queue(value.QueueId,
					value.QueueName,
					value.MaxCallTimes,
					value.QueueClassId,
					value.QueueClassName,
					value.IsActive));
		});
		return defered.resolve( arrQueue );
	},function(err){
		if (err) {
			console.log("executing proc_getUserAvilableQueue Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

Queue.getUserAvilableQueue = function(userid){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('userid', sql.Int, userid);	
		return customdefer.request_defered(request, 'proc_getUserAvilableQueue');
	}).then(function(data){
		var arrWindow = [];
		data.recordset[0].forEach(function(value){
			arrWindow.push(value.QueueId);
		});
		return arrWindow;
	},function(err){
		if (err) {
			console.log("executing proc_getUserAvilableQueue Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Queue.saveUserAvilableQueues = function(userid,arrQueueId){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('UserId', sql.Int, userid);	
		request.input('QueueIds', sql.VarChar(8000), ','+arrQueueId.join(',')+',');
		console.log(','+arrQueueId.join(',')+',')
		return customdefer.request_defered(request, 'proc_saveUserAvilableQueue');
	}).then(function(data){
		if(data.ret != 0){
			console.log("executing proc_saveUserAvilableQueue Error: " + data.recordset[0].errmsg);
		}
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_saveUserAvilableQueue Error: " + err.message);
			return err;
		}
	});
	return promise;
};

Queue.getQueueByClassId = function(classid){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('ClassId', sql.Int, classid);	
		return customdefer.request_defered(request, 'proc_getQueueInfoByClassId');
	}).then(function(data){
		var arrQueue = [];
		data.recordset[0].forEach(function(value){
			arrQueue.push((new Queue( value.QueueId,
					value.QueueName,
					value.MaxCallTimes,
					value.QueueClassId,
					value.QueueClassName,
					value.IsActive)));
		});
		return arrQueue;
	},function(err){
		if (err) {
			console.log("executing proc_getQueueInfoByClassId Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Queue.prototype.getMode = function(queueid){
	var queueId = queueid || this.id;
	var defered = Q.defer();
	QueueClass.prototype.getQueueClassByQueueId(queueId)
		.then(function(queueClass){
			if(!queueClass){
				defered.reject(-1);
			}else{
				defered.resolve(queueClass.mode);
			}
		}
		,function(err){
			console.log('get queueclass by queue id failed.');
			defered.reject(err);
		});
	return defered.promise;
};

Queue.prototype.getExternalSys = function(queueid){
	queueid = queueid || this.id;
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('QueueId', sql.Int, queueid);
		return customdefer.request_defered(request, 'proc_getExternalSysByQueueId');
	}).then(function(data){
		var record = data.recordset[0];
		if(record && record.length>0){
			var externalSys = new ExternalSys({
				id:record[0].Id,
				name:record[0].Name,
				pinyin:record[0].Pinyin,
				easyId:record[0].EasyId
			});
			return defered.resolve(externalSys);
		}else{
			return defered.reject(new Error('can not found external sys by queue id:'+queueid));
		}
	},function(err){
		if (err) {
			console.log("executing proc_getExternalSysByQueueId Error: " + err.message);
		}
		return defered.reject(err);
	});
	return defered.promise;
};
Queue.prototype.enqueue = function(personExternalId){
	var that = this;
	var defered = Q.defer();
	Q.all([that.getMode(), that.getExternalSys()])
		.then(function(result){
			var mode = result[0];
			var externalSys = result[1];
			if(mode===1){
				var person = new Person();
				person.initByExternalPersonId(personExternalId, externalSys.id)
					.then(function(p){
						Ticket.create(that, p)
							.then(function(ticket){
								defered.resolve(ticket);
							}
							,function(err){
								defered.reject(err);
							});
					},function(err){
						defered.reject(err);
					});
			}else if(mode === 0){
				Ticket.create(that)
					.then(function(ticket){
						defered.resolve(ticket);
					}
					,function(err){
						defered.reject(err);
					});
			}else{
				defered.reject(new Error('not defined mode code:'+mode));
			}
		},function(stat){
			defered.reject(new Error('get queue mode failed'));
		});
	return defered.promise;
};
module.exports = Queue;