var sql = require('mssql');
var customdefer = require('../customdefer');
var RecycleDetail = require('./drawdetail');
var Q = require('q');
var Config = require('../config');

function Recycle(obj){
    this.id = obj.id;
    this.returner = obj.returner;
    this.returnTime = obj.returnTime;
    this.recycler = obj.recycler;
    this.recycleTime = obj.recycleTime;
    this.remark = obj.remark;
    this.recycleDetails = obj.recycleDetails;
}

Recycle.prototype.init = function(id){
	this.id = id;
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	
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
	var config = Config.get('hybrid-sql');
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
	var config = Config.get('hybrid-sql');
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
					'drawId' : value.DrawId,
				    'barcode' : value.Barcode,
				    'useFlag' : value.UseFlag,
				    'recycleId' : value.RecycleId	    
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


Recycle.getRecyclesByRecycleIds = function(recycleIds){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		var xmlId = '';
		if(recycleIds && recycleIdslength>0){
			recycleIds.forEach(function(recycleId){
				xmlId+=
					'<recycle>'+
					'<id>' + recycleDetail.barcode + '</id>'+
					'</recycle>';
			});
		}
		request.input('RecycleIds', sql.Xml, xmlId);
		return customdefer.request_defered(request, 'proc_getRecyclesByRecycleIds');
	}).then(function(data){
		var arrRecycle = [];
		data.recordset[0].forEach(function(value){
			arrRecycle.push((new Recycle(
				{
					'id' : value.Id,
					'recycler' : value.Recycler,
				    'recycleTime' : value.RecycleTime,
				    'returner' : value.Returner,
				    'returnTime' : value.ReturnTime,
				    'remark' : value.Remark
				 }
				)));
		});
		defered.resolve(arrRecycle);
	},function(err){
		if (err) {
			console.log("executing proc_getRecyclesByRecycleIds Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

Recycle.prototype.getRecyclesPageInfo = function(dateBegin, dateEnd, barcode, returner, recycler, pageSize){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('BDate', sql.DateTime, dateBegin);
		request.input('EDate', sql.DateTime, dateEnd);
		request.input('Barcode', sql.VarChar(50), barcode);
		request.input('Returner', sql.NVarChar(100), returner);
		request.input('Recycler', sql.NVarChar(100), recycler);
		request.input('PageSize', sql.Int, pageSize);
		return customdefer.request_defered(request, 'proc_getRecyclesPageInfo');
	}).then(function(data){
		var records = data.recordset[0];
		if(records && records.length>0){
			defered.resolve({'totalRows':records[0].TotalRows||0, 'pageCount':records[0].PageCount||0});
		}else{
			defered.reject(new Error('proc_getRecyclesPageInfo error'));
		}
	},function(err){
		if (err) {
			console.log("executing proc_getDrawRecordPageInfo Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

Recycle.prototype.getRecyclesByCriterial = function(dateBegin, dateEnd, barcode, returner, recycler, pageNo, pageSize){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('BDate', sql.DateTime, dateBegin);
		request.input('EDate', sql.DateTime, dateEnd);
		request.input('Barcode', sql.VarChar(50), barcode);
		request.input('Returner', sql.NVarChar(100), returner);
		request.input('Recycler', sql.NVarChar(100), recycler);
		request.input('PageNo', sql.Int, pageNo);
		request.input('PageSize', sql.Int, pageSize);
		return customdefer.request_defered(request, 'proc_getRecyclesByCriterial');
	}).then(function(data){
		var recycles = [];
		data.recordset[0].forEach(function(value){
            recycles.push((new Recycle(
				{
					'id' : value.Id,
					'returner' : value.Returner,
                    'returnTime' : value.ReturnTime,
					'recycler' : value.Recycler,
                    'recycleTime' : value.RecycleTime,
					'remark' : value.Remark
				}
			)));
		});
		defered.resolve(recycles);
	},function(err){
		if (err) {
			console.log("executing proc_getRecyclesByCriterial Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

Recycle.prototype.deleteRecycle = function(){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var that = this;

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Id', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_deleteRecycle');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
	},function(err){
		if (err) {
			console.log("executing proc_deleteRecycle Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

module.exports = Recycle;