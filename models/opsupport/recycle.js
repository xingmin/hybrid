var sql = require('mssql');
var customdefer = require('../customdefer');
var RecycleDetail = require('./drawdetail');
var Q = require('q');

function Recycle(obj){
    this.id = obj.id;
    this.returner = obj.returner;
    this.returnTime = obj.returnTime;
    this.recycler = obj.recycler;
    this.recycleTime = obj.recycleTime;
    this.remark = obj.remark;
}

Recycle.prototype.init = function(id){
	this.id = id;
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('RecycleId', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_getRecycleByRecycleId');
	}).then(function(data){
		var record = data.recordset[0];
		if( record && record.length>0){
			that.recycler = record[0].Recycler;
			that.recycleTime = record[0].RecycleTime;
			that.returner = record[0].Returner;
			that.returnTime = record[0].ReturnTime;
			that.remark = record[0].Remark;
		}
		defered.resolve(that);
	},function(err){
		defered.reject(err);
	});
	return defered.promise;
};

Recycle.prototype.saveNewRecycle = function(){
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Returner', sql.VarChar(12), that.returner);
		request.input('ReturnTime', sql.DateTime, that.returnTime);
		request.input('Recycler', sql.VarChar(12), that.recycler);
		request.input('RecycleTime', sql.DateTime, that.recycleTime);
		request.input('Remark', sql.NVarChar(200), that.remark || null);
		var xmlBarcode = '';
		if(that.recycleDetails && that.recycleDetails.length>0){
			that.recycleDetails.forEach(function(recycleDetail){
				xmlBarcode+=
					'<row>'+
					'<barcode>' + recycleDetail.barcode + '</barcode>'+
					'<useflag>' + recycleDetail.useFlag + '</useflag>'+
					'</row>';
			});
		}
		request.input('Barcode', sql.Xml, xmlBarcode);
		return customdefer.request_defered(request, 'proc_addRecycleBarcode');
	}).then(function(data){
		if(data.ret === 0){
			that.id = data.recordset[0][0].RecycleId;
			defered.resolve(that);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
		
	},function(err){
		if (err) {
			console.log("executing proc_addRecycleBarcode Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};


Recycle.prototype.getRecycleDetailsByRecycleId = function(recycleId){
	var defered = Q.defer();
	var config = require('../connconfig').hybrid;
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('RecycleId', sql.Int, recycleId);
		return customdefer.request_defered(request, 'proc_getRecycleDetailByRecycleId');
	}).then(function(data){
		var arrRecycleDetail = [];
		data.recordset[0].forEach(function(value){
			arrRecycleDetail.push((new RecycleDetail(
				{
					'id' : value.Id,
					'drawId' : value.Consumer,
				    'barcode' : value.Receiver,
				    'useFlag' : value.Remark,
				    'recyleId' : value.Drawer			    
				 }
				)));
		});
		defered.resolve(arrRecycleDetail);
	},function(err){
		if (err) {
			console.log("executing proc_getRecycleDetailByRecycleId Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

module.exports = Recycle;