var sql = require('mssql');
var customdefer = require('../customdefer');
var DrawDetail = require('./drawdetail');
var Q = require('q');

function Recycle(obj){
    this.id = obj.id;
    this.returner = obj.returner;
    this.returnTime = obj.returnTime;
    this.recycler = obj.recycler;
    this.recycleTime = obj.recycleTime;
    this.remark = obj.remark;
}

Recycle.prototype.saveNewDrawRecord = function(){
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
		if(that.drawDetails && that.drawDetails.length>0){
			that.drawDetails.forEach(function(drawDetail){
				xmlBarcode+=
					'<row>'
					+'<barcode>' + drawDetail.barcode + '</barcode>'
					+'<useflag>' + drawDetail.useFlag + '</useflag>'
					+'</row>';
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

module.exports = Recycle;