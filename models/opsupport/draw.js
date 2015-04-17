var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');

function Draw(obj){
    this.id = obj.id;
    this.barcode = obj.barcode;
    this.receiver = obj.receiver;
    this.drawer = obj.drawer;
    this.drawTime = obj.drawTime;
    this.consumer = obj.consumer;
    this.useFlag = obj.useFlag;
    this.recyler = obj.recyler;
    this.recyleTime = obj.recyleTime;
    this.remark = obj.remark;
    this.photo = obj.photo;
}

Draw.prototype.init = function(id){
	this.id = id;
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Id', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_getDrawRecordById');
	}).then(function(data){
		var record = data.recordset[0];
		if( record && record.length>0){
		    that.barcode = record[0].Barcode;
		    that.receiver = record[0].Receiver;
		    that.drawer = record[0].Drawer;
		    that.drawTime = record[0].DrawTime;
		    that.consumer = record[0].Consumer;
		    that.useFlag = record[0].UseFlag;
		    that.recyler = record[0].Recyler;
		    that.recyleTime = record[0].RecyleTime;
		    that.remark = record[0].Remark;
		    that.photo = record[0].Photo;
		}
		defered.resolve(that);
	},function(err){
		defered.reject(err);
	});
	return defered.promise;
};

Draw.prototype.getDrawRecordsByDate = function(dateBegin, dateEnd){
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('BDate', sql.DateTime, dateBegin);
		request.input('EDate', sql.DateTime, dateEnd);
		return customdefer.request_defered(request, 'proc_getDrawRecordByDate');
	}).then(function(data){
		var arrDrawRecord = [];
		data.recordset[0].forEach(function(value){
			arrDrawRecord.push((new Draw(
				{
					'id' : value.Id,
				    'barcode' : value.Barcode,
				    'receiver' : value.Receiver,
				    'drawer' : value.Drawer,
				    'drawTime' : value.DrawTime,
				    'consumer' : value.Consumer,
				    'useFlag' : value.UseFlag,
				    'recyler' : value.Recyler,
				    'recyleTime' : value.RecyleTime,
				    'remark' : value.Remark,
				    'photo' : value.Photo
				 }
				)));
		});
		defered.resolve(arrDrawRecord);
	},function(err){
		if (err) {
			console.log("executing proc_getDrawRecordByDate Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};


Draw.prototype.saveNewDrawRecord = function(){
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Barcode', sql.VarChar(50), that.barcode);
		request.input('Receiver', sql.VarChar(12), that.receiver);
		request.input('Drawer', sql.VarChar(12), that.drawer);
		request.input('DrawTime', sql.DateTime, that.drawTime || null);
		request.input('Consumer', sql.NVarChar(50), that.consumer);
		request.input('Recycler', sql.VarChar(12), that.recycler);
		request.input('RecycleTime', sql.DateTime, that.recycleTime);
		request.input('Remark', sql.NVarChar(200), that.remark);
		request.input('Photo', sql.VarChar(8000), that.photo || null);
		return customdefer.request_defered(request, 'proc_addDrawRecord');
	}).then(function(data){
		if(data.ret === 0){
			that.id = data.recordset[0][0].Id;
			defered.resolve(that);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
		
	},function(err){
		if (err) {
			console.log("executing proc_addDrawRecord Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
Draw.prototype.updateDrawRecord = function(){
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Id', sql.Int, that.id);
		request.input('Barcode', sql.VarChar(50), that.barcode);
		request.input('Receiver', sql.VarChar(12), that.receiver);
		request.input('Drawer', sql.VarChar(12), that.drawer);
		request.input('DrawTime', sql.DateTime, that.drawTime || null);
		request.input('Consumer', sql.NVarChar(50), that.consumer);
		request.input('Recycler', sql.VarChar(12), that.recycler);
		request.input('RecycleTime', sql.DateTime, that.recycleTime);
		request.input('Remark', sql.NVarChar(200), that.remark);
		request.input('Photo', sql.VarChar(8000), that.photo || null);
		return customdefer.request_defered(request, 'proc_updateDrawRecord');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
	},function(err){
		if (err) {
			console.log("executing proc_updateDrawRecord Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

Draw.prototype.deleteDrawRecord = function(){
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Id', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_deleteDrawRecord');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
	},function(err){
		if (err) {
			console.log("executing proc_deleteDrawRecord Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
module.exports = Draw;