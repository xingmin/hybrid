var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');

function QueueClass(id, name, mode, py, externalSysId, externalSysName){
    this.id = id;
    this.name = name;
    this.mode = mode;
    this.pinyin = py;
    this.externalSysId = externalSysId;
    this.externalSysName = externalSysName;
}
QueueClass.prototype.getAllQueueClass = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	var conn = new sql.Connection(config);
	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		return customdefer.request_defered(request, 'proc_getQueueClassList');
	}).then(function(data){
		var arrQueueClass = [];
		data.recordset[0].forEach(function(value){
			arrQueueClass.push((new QueueClass(value.Id,
					value.Name,
					value.Mode,
					value.Pinyin,
					value.ExternalSysId,
					value.ExternalSysName)));
		});
		defered.resolve(arrQueueClass);
	},function(err){
		if (err) {
			console.log("executing proc_addQueueClass Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
QueueClass.prototype.getQueueClassByPinyin = function(py){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	var conn = new sql.Connection(config);

	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('pinyin', sql.VarChar(100), py);
		return customdefer.request_defered(request, 'proc_getQueueClassByPinyin');
	}).then(function(data){
		var arrQueueClass = [];
		data.recordset[0].forEach(function(value){
			arrQueueClass.push((new QueueClass(value.Id,
					value.Name,
					value.Mode,
					value.Pinyin,
					value.ExternalSysId,
					value.ExternalSysName)));
		});
		defered.resolve(arrQueueClass);
	},function(err){
		if (err) {
			console.log("executing proc_addQueueClass Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};


QueueClass.prototype.createNewQueueClass = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('name', sql.NVarChar(50), that.name);
		request.input('mode', sql.Int, that.mode);
		request.input('pinyin', sql.VarChar(50), that.pinyin);
		request.input('externalSysId', sql.Int, that.externalSysId);
		return customdefer.request_defered(request, 'proc_addQueueClass');
	}).then(function(data){
		that.id = data.recordset[0][0].ClassId;
		if(data.ret === 0){
			defered.resolve(that);
		}else{
			defered.reject(new Error('create queue class-' + that.name + 'failed!'));
		}
	},function(err){
		if (err) {
			console.log("executing proc_addQueueClass Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
QueueClass.prototype.updateQueueClass = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);
		request.input('name', sql.NVarChar(50), that.name);
		request.input('mode', sql.Int, that.mode);
		request.input('pinyin', sql.VarChar(50), that.pinyin);
		request.input('externalSysId', sql.Int, that.externalSysId);
		return customdefer.request_defered(request, 'proc_updateQueueClass');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error('update QueueClass failed.'+that.id));
		}
	},function(err){
		if (err) {
			console.log("executing proc_updateQueueClass Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

QueueClass.prototype.deleteQueueClass = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_deleteQueueClass');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error('delete queue class failed.'));
		}
	},function(err){
		if (err) {
			console.log("executing proc_deleteQueueClass Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

QueueClass.prototype.getQueueClassByQueueId = function(queueId){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var defered = Q.defer();
	customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('QueueId', sql.Int, queueId);
		return customdefer.request_defered(request, 'proc_getQueueClassByQueueId');
	}).then(function(data){
		var queueClass = null;
		var record = data.recordset[0];
		if(record && record.length>0){
			queueClass = new QueueClass(record[0].Id,
					record[0].Name,
					record[0].Mode,
					record[0].Pinyin,
					record[0].ExternalSysId,
					record[0].ExternalSysName);
		};
		defered.resolve(queueClass);
	},function(err){
		if (err) {
			console.log("executing proc_getQueueClassByQueueId Error: " + err.message);
			defered.reject(err);
		}
	});
	return defered.promise;
};



module.exports = QueueClass;