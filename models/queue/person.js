var sql = require('mssql');
var customdefer = require('../customdefer');
var ExternalSys = require('./externalsys');
var Q = require('q');

function Person(personId, externalPersonId, name){
    this.personId = personId;
    this.externalPersonId = externalPersonId;
    this.name = name;
    this._tryTimes = 2;
}
Person.prototype.resetTryTimesCounter=function(){
	this._tryTimes = 2;
};
Person.prototype.initByPersonId = function(personId){
	var config = require('../connconfig').queue;
	var conn = new sql.Connection(config);
	var that = this;

	var defered = Q.defer();
	customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('PersonId', sql.Int, personId);
		return customdefer.request_defered(request, 'proc_getPersonByPersonId');
	}).then(function(data){
		var record = data.recordset[0];
		if( record && record.length>0){
			that.personId = record[0].PersonId;
			that.externalPersonId = record[0].ExternalPersonId;
			that.name = record[0].Name;
			defered.resolve(that);
		}else{
			defered.reject(new Error('can not find person by person id:'+personId));
		}
	},function(err){
		if (err) {
			console.log("executing proc_getPersonByPersonId Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
Person.prototype.initByExternalPersonId= function(externalPersonId, externalSysId, defered){
	var that = this;
	that._tryTimes--;
	defered = defered || Q.defer();
	if(this._tryTimes < 0){
		defered.reject(new Error('failed to load person in the try times.'));
		return defered.promise;
	}
	that.getPersonByExternalPersonId(externalPersonId)
		.then(function(person){
			defered.resolve(person);
		},function(err){
			that.loadExternalToInternal(externalPersonId, externalSysId)
				.then(function(stat){
					that.initByExternalPersonId(externalPersonId, externalSysId, defered);
				});
		});
	return defered.promise;
};
Person.prototype.getPersonByExternalPersonId = function(externalPersonId){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;

	var defered = Q.defer();
	customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('ExternalPersonId', sql.VarChar(50), externalPersonId);
		return customdefer.request_defered(request, 'proc_getPersonByExternalPersonId');
	}).then(function(data){
		var record = data.recordset[0];
		if( record && record.length>0){
			that.personId = record[0].PersonId;
			that.externalPersonId = record[0].ExternalPersonId;
			that.name = record[0].Name;
			defered.resolve(that);
		}else{
			defered.reject(new Error('can not find person by external person id:'+externalPersonId));
		}
	},function(err){
		if (err) {
			console.log("executing proc_getPersonByExternalPersonId Error: " + err.message);
		}
		defered.reject(err);
	});
	return defered.promise;
};
//从第三方的系统获取person的信息，导入本系统中
//方式一：直接访问第三方数据库
//proc_loadExternalToInternal
//返回值0 成功
//返回值非0 失败 errmsg失败的详细信息
Person.prototype.loadExternalToInternal= function(externalPersonId, externalSysId){
	var defered = Q.defer();
	var that = this;
	
	var extsys = new ExternalSys();
	extsys.init(externalSysId)
		.then(function(d){
			var extapi;
			ExternalSys.externalSysAPIs.forEach(function(obj){
				if(obj.easyId === extsys.easyId){
					extapi = obj;
				}
			});
			if(!extapi){
				return defered.reject(new Error('can not find external sys by id:'+externalSysId));
			}
		 
			extapi.getPersonInfoFromExternalSys(externalPersonId)
				.then(function(personinfo){
					return extapi.writeExternalPersonInfoToInternal(personinfo, externalSysId);
				})
				.then(function(stat){
					defered.resolve(0);
				},function(err){
					defered.reject(err);
				});
		},function(err){
			defered.reject(err);
		});
	return defered.promise;
};

module.exports = Person;

