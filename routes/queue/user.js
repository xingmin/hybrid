var express = require('express');
var router = express.Router();
var User = require("../../models/queue/user.js");
var Q = require('q');
var ResData = require("../resdata.js");


router.post('/create', function(req, res) {	
	var name = req.body.name;	
	var loginid = req.body.loginid;
	var pwd = req.body.pwd;
	var empcode = req.body.empcode;
	var user = new User(null,
			name,
			loginid,
			pwd,
			empcode
			);
	user.createNewUser()
		.then(function(status){
			var resdata;		
			if(status instanceof Error){
				resdata = new ResData(1, status.message);
			}else{
				resdata = new ResData(0, '', user);
			}
			resdata.sendJson(res);	
		});
});

router.post('/update', function(req, res) {	 
	var id = req.body.id;	 
	var name = req.body.name;	
	var loginid = req.body.loginid;
	var pwd = req.body.pwd;
	var empcode = req.body.empcode;
	var user = new User(id,
			name,
			loginid,
			pwd,
			empcode
			);
	user.updateUser()
		.then(function(status){
			var resdata;		
			if(status instanceof Error){
				resdata = new ResData(status, status.message);
			}else{
				resdata = new ResData(0, '', user);
			}
			resdata.sendJson(res);	
		});
});

router.post('/delete', function(req, res) {	
	var id = req.body.id;	 
	var user = new User(id);
	user.deleteUser()
		.then(function(status){
			var resdata;		
			if(status instanceof Error){
				resdata = new ResData(status.status, status.message);
			}else{
				resdata = new ResData(status.status);
			}
			resdata.sendJson(res);	
		});
});
router.get('/', function(req, res) {	
	User.getAllUsers()
		.then(function(data){
			var resdata;		
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0,'',data);
			}
			resdata.sendJson(res);	
		});
});
router.post('/querybypwd', function(req, res) {	
	var id = req.body.loginid;	 
	var pwd = req.body.pwd;	 
	var user = new User(null, null, id, pwd, null);
	user.getUserInfoByPwd()
		.then(function(data){
			var resdata;		
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0, '', data);
			}
			resdata.sendJson(res);	
		});
});
//router.get('/get/py/:py', function(req, res) {	
//	var pinyin = req.param('py');
//	User.prototype.getUserByPinyin(pinyin)
//		.then(function(data){
//			var resdata;		
//			if(data instanceof Error){
//				resdata = new ResData(data.status, data.message);
//			}else{
//				resdata = new ResData(0,'',data);
//			}
//			resdata.sendJson(res);	
//		});
//});
module.exports = router;
