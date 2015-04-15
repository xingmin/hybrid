var sql = require('mssql'); 
var customdefer = require('../customdefer');

function User(id, name, loginid, pwd, empcode){
    this.id = id;
    this.name = name;
    this.loginid = loginid;
    this.pwd = pwd;
    this.empcode = empcode;
};

//User.prototype.getQueueClassByPinyin = function(py){
//	var config = require('../connconfig').queue;
//	
//	var conn = new sql.Connection(config);
//
//	var promise = customdefer.conn_defered(conn).then(function(conn){
//		var request = new sql.Request(conn);	
//		request.input('pinyin', sql.VarChar(100), py);	
//		return customdefer.request_defered(request, 'proc_getQueueClassByPinyin');
//	}).then(function(data){
//		var arrQueueClass = [];
//		data.recordset[0].forEach(function(value){
//			arrQueueClass.push((new User( value.Id,value.Name)));
//		});
//		return arrQueueClass;
//	},function(err){
//		if (err) {
//			console.log("executing proc_addQueueClass Error: " + err.message);
//			return err;
//		}
//	});
//	return promise;
//};


User.prototype.createNewUser = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('name', sql.NVarChar(32), that.name);		
		request.input('loginid', sql.VarChar(50), that.loginid);	
		request.input('pwd', sql.VarChar(50), that.pwd);
		request.input('empcode', sql.VarChar(50), that.empcode);
		return customdefer.request_defered(request, 'proc_addUser');
	}).then(function(data){
		that.id = data.recordset[0][0].Id;
		return that;
	},function(err){
		if (err) {
			console.log("executing proc_addUser Error: " + err.message);
			return err;
		}
	});
	return promise;
};
User.prototype.updateUser = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);	
		request.input('name', sql.NVarChar(32), that.name);		
		request.input('loginid', sql.VarChar(50), that.loginid);	
		request.input('pwd', sql.VarChar(50), that.pwd);
		request.input('empcode', sql.VarChar(50), that.empcode);
		return customdefer.request_defered(request, 'proc_updateUser');
	}).then(function(data){
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_updateUser Error: " + err.message);
			return err;
		}
	});
	return promise;
};

User.prototype.deleteUser = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);		
		return customdefer.request_defered(request, 'proc_deleteUser');
	}).then(function(data){
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_deleteUser Error: " + err.message);
			return err;
		}
	});
	return promise;
};
User.getAllUsers = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		return customdefer.request_defered(request, 'proc_getUserList');
	}).then(function(data){
		var arrUser = [];
		data.recordset[0].forEach(function(value){
			arrUser.push((new User( value.Id, 
					value.Name,
					value.LoginId,
					value.Pwd,
					value.EmpCode)));
		});
		return arrUser;
	},function(err){
		if (err) {
			console.log("executing proc_getUserList Error: " + err.message);
			return err;
		}
	});
	return promise;
};
User.prototype.getUserInfoByPwd = function(userloginid, userpwd){
	var loginid,pwd,that;
	if (userloginid && userpwd){
		loginid = userloginid;
		pwd = userpwd;
	}else{
		loginid = this.loginid;
		pwd = this.pwd;
		that = this;
	}
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('LoginId', sql.VarChar(50), loginid);	
		request.input('Pwd', sql.VarChar(50), pwd);	
		return customdefer.request_defered(request, 'proc_getUserInfoByPwd');
	}).then(function(data){
		if(data.recordset[0].length<=0)
			return null;
		if(that){
			that.id = data.recordset[0][0].Id;
			that.name = data.recordset[0][0].Name;
			that.empcode = data.recordset[0][0].EmpCode;
		}
 		return that? that: new User(data.recordset[0].Id, 
				data.recordset[0][0].Name,
				data.recordset[0][0].LoginId,
				data.recordset[0][0].Pwd,
				data.recordset[0][0].EmpCode);
	},function(err){
		if (err) {
			console.log("executing proc_getUserInfoByPwd Error: " + err.message);
			return err;
		}
	});
	return promise;
};
module.exports = User;