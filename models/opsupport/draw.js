var sql = require('mssql');
var customdefer = require('../customdefer');
var DrawDetail = require('./drawdetail');
var Q = require('q');
var Config = require('../config');

function Draw(obj){
    this.id = obj.id;
    this.consumer = obj.consumer;
    this.receiver = obj.receiver;
    this.remark = obj.remark;
    this.drawer = obj.drawer;
    this.drawTime = obj.drawTime;
	this.expectedReceiveTime = obj.expectedReceiveTime;
    this.drawDetails = obj.drawDetails;
}

Draw.prototype.init = function(id){
	this.id = id;
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Id', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_getDrawRecordById');
	}).then(function(data){
		var record = data.recordset[0];
		if( record && record.length>0){
			that.consumer = record[0].Consumer;
		    that.receiver = record[0].Receiver;
		    that.remark = record[0].Remark;
		    that.drawer = record[0].Drawer;
		    that.drawTime = record[0].DrawTime;
			that.expectedReceiveTime = record[0].ExpectedReceiveTime;
		}
		defered.resolve(that);
	},function(err){
		defered.reject(err);
	});
	return defered.promise;
};


Draw.prototype.getDrawRecordsPageInfo = function(dateBegin, dateEnd, barcode, consumer, receiver, pageSize){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('BDate', sql.DateTime, dateBegin);
		request.input('EDate', sql.DateTime, dateEnd);
		request.input('Barcode', sql.VarChar(50), barcode);
		request.input('Consumer', sql.NVarChar(100), consumer);
		request.input('Receiver', sql.NVarChar(100), receiver);
		request.input('PageSize', sql.Int, pageSize);
		return customdefer.request_defered(request, 'proc_getDrawRecordPageInfo');
	}).then(function(data){
		var records = data.recordset[0];
		if(records && records.length>0){
			defered.resolve({'totalRows':records[0].TotalRows||0, 'pageCount':records[0].PageCount||0});
		}else{
			defered.reject(new Error('proc_getDrawRecordPageInfo error'));
		}
	},function(err){
		if (err) {
			console.log("executing proc_getDrawRecordPageInfo Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

Draw.prototype.getDrawRecordsByDate = function(dateBegin, dateEnd, barcode, consumer, receiver, pageNo, pageSize){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('BDate', sql.DateTime, dateBegin);
		request.input('EDate', sql.DateTime, dateEnd);
		request.input('Barcode', sql.VarChar(50), barcode);
        request.input('Consumer', sql.NVarChar(100), consumer);
		request.input('Receiver', sql.NVarChar(100), receiver);
		request.input('PageNo', sql.Int, pageNo);
		request.input('PageSize', sql.Int, pageSize);
		return customdefer.request_defered(request, 'proc_getDrawRecordByDate');
	}).then(function(data){
		var arrDrawRecord = [];
		data.recordset[0].forEach(function(value){
			arrDrawRecord.push((new Draw(
				{
					'id' : value.Id,
					'consumer' : value.Consumer,
				    'receiver' : value.Receiver,
				    'remark' : value.Remark,
				    'drawer' : value.Drawer,
				    'drawTime' : value.DrawTime,
					'expectedReceiveTime': value.ExpectedReceiveTime
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
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Consumer', sql.NVarChar(50), that.consumer);
		request.input('Receiver', sql.VarChar(12), that.receiver);
		request.input('Remark', sql.NVarChar(200), that.remark);
		request.input('Drawer', sql.VarChar(12), that.drawer);
		request.input('DrawTime', sql.DateTime, that.drawTime || null);
		request.input('ExpectedReceiveTime', sql.DateTime, that.expectedReceiveTime || null);
		var xmlBarcode = '';
		if(that.drawDetails && that.drawDetails.length>0){
			that.drawDetails.forEach(function(drawDetail){
				xmlBarcode+='<row> <barcode>' + drawDetail.barcode + '</barcode> </row>';
			});
		}
		request.input('Barcode', sql.Xml, xmlBarcode);
		return customdefer.request_defered(request, 'proc_addDrawRecord');
	}).then(function(data){
		if(data.ret === 0){
			that.id = data.recordset[0][0].DrawId;
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
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Id', sql.Int, that.id);
		request.input('Consumer', sql.NVarChar(50), that.consumer);		
		request.input('Receiver', sql.VarChar(12), that.receiver);
		request.input('Remark', sql.NVarChar(200), that.remark);
		request.input('Drawer', sql.VarChar(12), that.drawer);
		request.input('DrawTime', sql.DateTime, that.drawTime || null);
		request.input('ExpectedReceiveTime', sql.DateTime, that.expectedReceiveTime || null);
		var xmlBarcode = '';
		if(that.drawDetails && that.drawDetails.length>0){
			that.drawDetails.forEach(function(drawDetail){
				xmlBarcode+='<row> <barcode>' + drawDetail.barcode + '</barcode> </row>';
			});
		}
		request.input('Barcode', sql.Xml, xmlBarcode);
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
	var config = Config.get('hybrid-sql');
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

Draw.prototype.getDrawDetails = function(){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var that = this;
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('DrawId', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_getDrawDetailByDrawId');
	}).then(function(data){
		var arrDrawDetail = [];
		data.recordset[0].forEach(function(value){
			arrDrawDetail.push((new DrawDetail(
				{
					'id' : value.Id,
					'drawId' : value.DrawId,
				    'barcode' : value.Barcode,
				    'useFlag' : value.UseFlag,
				    'recycleId' : value.RecycleId
				 }
				)));
		});
		defered.resolve(arrDrawDetail);
	},function(err){
		if (err) {
			console.log("executing proc_getDrawDetailByDrawId Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
module.exports = Draw;