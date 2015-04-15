var express = require('express');
var router = express.Router();
var user = require("../models/users.js");


router.get('/', function(req, res) {
  res.render('register', { });
});


router.post('/register', function(req, res) {
	var name = req.body.username;	
	var loginid = req.body.userloginid;
	var sex = req.body.usersex;
	var empcode = req.body.usercode;
	var email = req.body.useremail;
	var mobile = req.body.usermobile;
	var socialno = req.body.usersocialno;
	var deptid = req.body.userdeptid;
	var userdept = req.body.userdept;
	var userintroducer = req.body.introducername;
	var userintroducerpwd = req.body.introducerpwd;
	
	var Client = require("./client.js");
	var clientip =(new Client(req)).getClientIp();
	var stat;
	if (typeof(name) == 'undefined' || name.trim() == ''){
		stat = { 'status':0,
				'msg':'姓名不能为空！'};
	}else if(typeof(loginid) == 'undefined' || loginid.trim() == ''){
		stat = { 'status':0,
				'msg':'登录用户名不能为空！'};		
	}else if(typeof(socialno) == 'undefined' || socialno.trim() == ''){
		stat = { 'status':0,
				'msg':'身份证号不能为空！'};
	}else if(typeof(userdept) == 'undefined' || userdept.trim() == ''){
		stat = { 'status':0,
				'msg':'科室不能为空！'};	
	}	
	if (typeof(stat) != 'undefined'){		
		res.setHeader('Content-Type','application/json;charset=utf-8');
		console.log(stat);
		res.send(JSON.stringify(stat));
		return;		
	}
	user.findUserIdByPwd(userintroducer,userintroducerpwd,
		function(err, record){
			if (typeof(record) == 'undefined' || record.length<=0 || record[0].length<=0){ 
				var stat;
				stat = { 'status':0,
						'msg':'介绍人暨原来有OA帐号的用户登录信息验证错误！'};	
				res.setHeader('Content-Type','application/json;charset=utf-8');
				console.log(stat);
				res.send(JSON.stringify(stat));
				return;
			}
			var introducerid = record[0][0].EmpID;
			user.register(name,
				loginid,
				sex,
				empcode,
				email,
				mobile,
				socialno,
				deptid,
				introducerid,
				clientip,
				function(err, returnval){
					res.setHeader('Content-Type','application/json;charset=utf-8');
					var stat = { 'status':returnval}
					console.log(stat);
					res.send(JSON.stringify(stat));
				});			
		});

});
module.exports = router;
