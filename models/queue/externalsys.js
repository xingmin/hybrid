var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');

var ExternalSysAPIs =
[
//His接口范例,有三个属性:easyId,getPersonInfoFromExternalSys,writeExternalPersonInfoToInternal
	{
		easyId:'FounderHis',
		getPersonInfoFromExternalSys:function(externalPersonId){
			var config = require('../connconfig').queueexternal;	
			var conn = new sql.Connection(config);
			var defered = Q.defer();
			customdefer.conn_defered(conn).then(function(conn){
				var request = new sql.Request(conn);
				//存储过程的名称和参数可以改变
				request.input('ExternalPersonId', sql.VarChar(50), externalPersonId);
				return customdefer.request_defered(request, 'proc_queryExternalPersonInfo');
			}).then(function(data){
				var record = data.recordset[0];
				if(record && record.length>0){
					//这里自己定义personInfo的结构，方便在这两个函数之间传递数据
					//这个地方有问题?????/
					defered.resolve({
						 "externalPersonId":externalPersonId,
						 "name":record[0].name
						});
				}else{
					return defered.reject(new Error('can not find person form external system. id:'+externalPersonId));
				}
			},function(err){
				if (err) {
					console.log("executing  Error: " + err.message);
				}
				defered.reject(err);
			});
			return defered.promise;
		},
		writeExternalPersonInfoToInternal:function(personInfo, extSysId){
			var config = require('../connconfig').queue;
			var conn = new sql.Connection(config);
			var defered = Q.defer();
			customdefer.conn_defered(conn).then(function(conn){
				var request = new sql.Request(conn);
				//定义存储过程的参数
				//...
				request.input('ExternalPersonId', sql.VarChar(50), personInfo.externalPersonId);
				request.input('Name', sql.NVarChar(50), personInfo.name);
				request.input('ExternalSysId', sql.Int, extSysId);
				request.input('ExternalSysEasyId', sql.VarChar(50), '');
				return customdefer.request_defered(request, 'proc_addPerson');
			}).then(function(data){
				if(data.ret !== 0 ){
					return defered.reject(new Error(recordset[0][0].errmsg));
				}
				defered.resolve(data.recordset[0][0].PersonId);
			},function(err){
				console.log("executing  Error: " + err.message);
				defered.reject(err);
			});
			return defered.promise;
		}
	},
	{
		
	}
];
var ExternalSys = function(opt){
	this.id = opt ? opt.id : null;
	this.name = opt ? opt.name : null;
	this.pinyin = opt ? opt.pinyin : null;
	this.easyId = opt ? opt.easyId : null;
};
ExternalSys.prototype.getAllExternalSys = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		return customdefer.request_defered(request, 'proc_getExternalSysList');
	}).then(function(data){
		var arrExternalSys = [];
		data.recordset[0].forEach(function(value){
			arrExternalSys.push(new ExternalSys({id:value.Id,
					name:value.Name,
					pinyin:value.Pinyin,
					easyId:value.EasyId
					}));
		});
		return defered.resolve(arrExternalSys);
	},function(err){
		if (err) {
			console.log("executing proc_getExternalSysList Error: " + err.message);
		}
		return defered.reject(err);
	});
	return defered.promise;
};
ExternalSys.prototype.init = function(id){
	var that = this;
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, id);
		return customdefer.request_defered(request, 'proc_getExternalSysById');
	}).then(function(data){
		var record = data.recordset[0];
		if(record && record.length>0){
			that.id = record[0].Id;
			that.name = record[0].Name;
			that.pinyin = record[0].Pinyin;
			that.easyId = record[0].EasyId;
			return defered.resolve(that);
		}else{
			return defered.reject(new Error('not found external sys by id:'+id));
		}
	},function(err){
		if (err) {
			console.log("executing proc_getExternalSysById Error: " + err.message);
		}
		return defered.reject(err);
	});
	return defered.promise;
};
ExternalSys.prototype.createNewExternalSys = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('name', sql.NVarChar(50), that.name);
		request.input('pinyin', sql.VarChar(50), that.pinyin);
		request.input('easyId', sql.VarChar(50), that.easyId);
		return customdefer.request_defered(request, 'proc_addExternalSys');
	}).then(function(data){
		if(data.ret === 0){
			that.id = data.recordset[0][0].Id;
			return defered.resolve(that);
		}else{
			return defered.reject(new Error('add ExternalSys failed!'));
		}
	},function(err){
		if (err) {
			console.log("executing proc_addExternalSys Error: " + err.message);
		}
		return defered.reject(err);
	});
	return defered.promise;
};
ExternalSys.prototype.updateExternalSys = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);
		request.input('name', sql.NVarChar(50), that.name);
		request.input('pinyin', sql.VarChar(50), that.pinyin);
		request.input('easyid', sql.VarChar(50), that.easyId);
		return customdefer.request_defered(request, 'proc_updateExternalSys');
	}).then(function(data){
		if(data.ret === 0){
			return defered.resolve(data.ret);
		}else{
			return defered.reject(new Error('更新失败'));
		}
	},function(err){
		if (err) {
			console.log("executing proc_updateExternalSys Error: " + err.message);
		}
		return defered.reject(err);
	});
	return defered.promise;
};

ExternalSys.prototype.deleteExternalSys = function(){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_deleteExternalSys');
	}).then(function(data){
		return defered.resolve(data.ret);
	},function(err){
		if (err) {
			console.log("executing proc_deleteExternalSys Error: " + err.message);
		}
		return defered.reject(err);
	});
	return defered.promise;
};
ExternalSys.prototype.getExternalSysByPinyin = function(py){
	var defered = Q.defer();
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise =  customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('pinyin', sql.VarChar(50), py);
		return customdefer.request_defered(request, 'proc_getExternalSysByPinyin');
	}).then(function(data){
		var arrExternalSys = [];
		data.recordset[0].forEach(function(value){
			arrExternalSys.push((new ExternalSys({id:value.Id, 
				name:value.Name, 
				pinyin:value.Pinyin, 
				easyId:value.EasyId})));
		});
		return defered.resolve(arrExternalSys);
	},function(err){
		if (err) {
			console.log("executing proc_getExternalSysByPinyin Error: " + err.message);
		}
		return defered.reject(err);
	});
	return defered.promise;
};

ExternalSys.externalSysAPIs = ExternalSysAPIs;
module.exports = ExternalSys;