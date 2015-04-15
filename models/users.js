var sql = require('mssql'); 

function User(person){
    this.name = person.name;
    this.loginid = person.loginid;
	this.sex = person.sex;
	this.empcode = person.empcode;
	this.email = person.email;
	this.mobile = person.mobile;
	this.socialno = person.socialno;
	this.deptid = person.deptid;
	this.register_time= person.register_time;
};

module.exports = User;

User.findUserIdByPwd = function(loginid, pwd, callback){
	var config = require('./connconfig').oa;
	sql.connect(config, function(err) {
		// ... error checks
		if (err) {
			console.log("User_Sql Error: " + err.message);
			return;
		}
		// Stored Procedure
		var request = new sql.Request();
		request.input('loginId', sql.VarChar(50), loginid);
		request.input('pwd', sql.VarChar(50), pwd);
		request.execute('xingmin_getUserInfoByPwd', function(err, recordsets, returnValue) {
			// ... error checks
			if (err) {
				console.log("executing xingmin_getUserInfoByPwd Error: " + err.message);
			}
			callback(err, recordsets);
		});
	});    
};

//
User.register = function registerUser(name,
		loginid, 
		sex,
		empcode,
		email,
		mobile,
		socialno,
		deptid,
		introducerid,
		clientip,
		callback) {
	var config = require('./connconfig').oa;
	sql.connect(config, function(err) {
		// ... error checks
		if (err) {
			console.log("User_Sql Error: " + err.message);
			return;
		}
		// Stored Procedure
		var request = new sql.Request();
		request.input('name', sql.VarChar(50), name);
		request.input('loginid', sql.VarChar(50), loginid);
		request.input('sex', sql.Int, sex);
		request.input('empcode', sql.VarChar(20), empcode);
		request.input('email', sql.VarChar(50), email);
		request.input('mobile', sql.VarChar(50), mobile);
		request.input('socialno', sql.VarChar(50), socialno);
		request.input('deptid', sql.Int, deptid);
		request.input('introducer', sql.Int, introducerid);
		request.input('clientip', sql.VarChar(50), clientip);
		request.execute('xingmin_register_user', function(err, recordsets, returnValue) {
			// ... error checks
			if (err) {
				console.log("executing register_user Error: " + err.message);
			}

			callback(err, returnValue);
		});
	});    

};

