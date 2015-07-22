var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');
var config = require('../config');
var _ = require('lodash');

function PerformanceDept(obj){
    this.deptId = obj.deptId;
    this.deptName = obj.deptName;
	this.pinYin = obj.pinYin;
    this.OAEmpId = obj.OAEmpId;
}
PerformanceDept.ConvertFromDB = function(record){
	return new PerformanceDept({
		deptId: record["DeptId"],
		deptName: record["DeptName"],
		pinYin: record["PinYin"],
		OAEmpId: record["OAEmpId"]
	});
};
PerformanceDept.getPerformanceDepts = function(pinYin){
	var defered = Q.defer();
	var connection = new sql.Connection(config.get('hybrid-sql'), function(err) {
		if(err){
			console.log("executing getPerformanceDepts Error: " + err.message);
			defered.reject(err);
			return;
		}
		var request = new sql.Request(connection);
		pinYin = pinYin || '';
		var sqlstatement = "select DeptId, DeptName, PinYin, OAEmpId from PerformanceDept where isnull(PinYin,'') like '"+pinYin+"%'";
		request.query(sqlstatement, function(err, recordset) {
			if(err){
				connection.close();
				console.log("executing getPerformanceDepts Error: " + err.message);
				defered.reject(err);
				return;
			}
			var result = null;
			result = _.map(recordset, function(record){
				return PerformanceDept.ConvertFromDB(record);
			});
			connection.close();
			defered.resolve(result);
		});
	});
	return defered.promise;
};

PerformanceDept.prototype.saveNew = function(){
	var defered = Q.defer();
	var conn = new sql.Connection(config.get('hybrid-sql'));
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('DeptName', sql.NVarChar(60), that.deptName);
		request.input('PinYin', sql.VarChar(60), that.pinYin);
		request.input('OAEmpId', sql.Int, that.OAEmpId);
		return customdefer.request_defered(request, 'proc_addPerformanceDept');
	}).then(function(data){
		if(data.ret === 0){
			that.deptId = data.recordset[0][0].DeptId;
			defered.resolve(that);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
		
	},function(err){
		if (err) {
			console.log("executing proc_addPerformanceDept Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
PerformanceDept.prototype.saveUpdate = function(){
	var defered = Q.defer();
	var conn = new sql.Connection(config.get('hybrid-sql'));
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('DeptId', sql.Int, that.deptId);
		request.input('DeptName', sql.NVarChar(60), that.deptName);
		request.input('PinYin', sql.VarChar(60), that.pinYin);
		request.input('OAEmpId', sql.Int, that.OAEmpId);
		return customdefer.request_defered(request, 'proc_updatePerformanceDept');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
	},function(err){
		if (err) {
			console.log("executing proc_updatePerformanceDept Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

PerformanceDept.prototype.deletePerformanceDept = function(){
	var defered = Q.defer();
	var conn = new sql.Connection(config.get('hybrid-sql'));
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('DeptId', sql.Int, that.deptId);
		return customdefer.request_defered(request, 'proc_deletePerformanceDept');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
	},function(err){
		if (err) {
			console.log("executing proc_deletePerformanceDept Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

module.exports = PerformanceDept;