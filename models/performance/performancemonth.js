var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');
var config = require('../config');
var _ = require('lodash');

function PerformanceMonth(obj){
    this.monthId= obj.monthId;
    this.year = obj.year;
	this.month = obj.month;
    this.status = obj.status;
}
PerformanceMonth.ConvertFromDB = function(record){
	return new PerformanceMonth({
		monthId: record["Id"],
		year: record["Year"],
		month: record["Month"],
		status: record["Status"]
	});
};

PerformanceMonth.prototype.getPerformanceMonthByCriterial = function(pageNo, pageSize, minYear, minMonth, maxYear, maxMonth){
	var defered = Q.defer();
	var config = Config.get('hybrid-sql');
	var conn = new sql.Connection(config);
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		var xmlCriterial = "";
		xmlCriterial ="<row>"+
			"<minMonth>"+minYear+"-"+minMonth+"</minMonth>"+
			"<maxMonth>"+maxYear+"-"+maxMonth+"</maxMonth>"+
			"</row>"
		request.input('Criterial', sql.Xml, xmlCriterial);
		request.input('PageNo', sql.Int, pageNo);
		request.input('PageSize', sql.Int, pageSize);
		return customdefer.request_defered(request, 'proc_getPerformanceMonthByCriterial');
	}).then(function(data){
		var months = [];
		data.recordset[0].forEach(function(value){
			months.push((new PerformanceMonth(
				{
					'monthId' : value.Id,
					'year' : value.Year,
					'month' : value.Month,
					'status' : value.Status
				}
			)));
		});
		defered.resolve(months);
	},function(err){
		if (err) {
			console.log("executing proc_getPerformanceMonthByCriterial Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

PerformanceMonth.prototype.saveNew = function(){
	var defered = Q.defer();
	var conn = new sql.Connection(config.get('hybrid-sql'));
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('Year', sql.Int, that.year);
		request.input('Month', sql.Int, that.month);
		return customdefer.request_defered(request, 'proc_addPerformanceMonth');
	}).then(function(data){
		if(data.ret === 0){
			that.monthId = data.recordset[0][0].MonthId;
			defered.resolve(that);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
		
	},function(err){
		if (err) {
			console.log("executing proc_addPerformanceMonth Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};


PerformanceMonth.prototype.delete = function(){
	var defered = Q.defer();
	var conn = new sql.Connection(config.get('hybrid-sql'));
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('MonthId', sql.Int, that.monthId);
		return customdefer.request_defered(request, 'proc_deletePerformanceMonth');
	}).then(function(data){
		if(data.ret === 0){
			defered.resolve(data.ret);
		}else{
			defered.reject(new Error(data.recordset[0][0].errmsg));
		}
	},function(err){
		if (err) {
			console.log("executing proc_deletePerformanceMonth Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};

module.exports = PerformanceMonth;