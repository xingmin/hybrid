var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();

var libs = path.resolve(__dirname, '../')+"/";

var db = require(libs + 'db/mongoose');
var User = require('../model/user');
var Result = require('./result');
var UserInfo = require('./userinfo');
var rbac = require('../rbac/initrbac');
var RBACMidware = require('../rbac/rbacmidware');

//get user list
router.get('/',
    passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'list', 'user'),
	function(req, res) {
		var py = req.query.py;
		var empCode = req.query.empCode;
		if(py && py.length>0){
			py = py.toLowerCase();
		}
		var critiral = {
		};
		if (py) { critiral.legalNamePY = {$regex: '^'+py}; }
        if (empCode) { critiral.empcode = empCode; }
		User.find(critiral).exec()
			.then(
				function(users){
					res.json(new Result(0, '', UserInfo.convertFromUsers(users)));
				},
				function(err){
					res.json(new Result(1, err.message));
				}
			);
	}
);
//create new user
router.post('/',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'create', 'user'),
	function(req, res) {
		var userinfo = req.body.userinfo;
		if(userinfo.legalNamePY && userinfo.legalNamePY.length>0) {
			userinfo.legalNamePY = userinfo.legalNamePY.toLowerCase();
		}
		var user = UserInfo.prototype.convertToUser.call(userinfo);
		user.save(function(err){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, 'save succeeded!',  UserInfo.convertFromUsers(user));
			}
			res.json(result);
		});
	}
);

//update user
router.post('/update',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'update', 'user'),
	function(req, res) {
		var userinfo = req.body.userinfo;
		User.findById(userinfo.userId,
			function(err, user){
				if(err){
					result = new Result(1, err, null);
					res.json(result);
					return;
				}
				if (userinfo.userName) { user.username = userinfo.userName; }
				if (userinfo.legalName){ user.legalname = userinfo.legalName;}
				if (userinfo.password) { user.password = userinfo.password;}
				if (userinfo.role) { user.role = userinfo.role;}
				if (userinfo.legalNamePY){ user.legalNamePY = userinfo.legalNamePY;}
				if (userinfo.empCode){ user.empcode = userinfo.empCode; }
				user.save(function(err){
					var result = null;
					if(err){
						result = new Result(2, err, null);
					}
					result = new Result(0, 'save update succeeded!', null);
					res.json(result);
				});
			}
		);
	}
);
//delete a user
router.delete('/:userId',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'delete', 'user'),
	function(req, res) {
		var userId = req.params.userId;
		User.findByIdAndRemove(userId, {}, function(err, user){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, 'save delete succeeded!', null);
			}
			res.json(result);
		});
	}
);
router.post('/checkpassword/',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'check-password', 'user'),
	function(req, res) {
		var userName = req.body.username;
		var password = req.body.password;
		User.checkUserNamePassword(userName, password, function(err, passed){
			if(passed){
				return (result = new Result(0, 'user check succeess', null) && res.json(result));
			}
			result = new Result(1, err, null);
			res.json(result);
		});
	}
);
router.get('/checkperm',
	passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var action = req.query.action;
		var resource = req.query.resource;
		var perm = {action: action, resource: resource};
		if(!req.user) {
			return (new Result(1, '用户验证信息失败', perm)).json(res);
		}
		req.user.can(rbac, action, resource, function(err, can) {
			if(err) {
				return (new Result(3, err, perm)).json(res);
			}
			if(!can) {
				return (new Result(2, '此用户没有权限', perm)).json(res);
			}
			return (new Result(0, '此用户拥有此权限', perm)).json(res);
		});	
	}
);

router.get('/getuserbytoken',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        var result = new Result(0, '',  UserInfo.convertFromUsers(req.user));
        result.json(res);
    }
);
module.exports = router;