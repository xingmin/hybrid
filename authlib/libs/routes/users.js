var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();

var libs = path.resolve(__dirname, '../..')+ '/libs/';

var db = require(libs + 'db/mongoose');
var User = require('../model/user');
var Result = require('./result');
var UserInfo = require('./userinfo');

router.get('/info', passport.authenticate('bearer', { session: false }),
    function(req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({
        	user_id: req.user.userId, 
        	name: req.user.username, 
        	scope: req.authInfo.scope 
        });
    }
);
//get user list
router.get('/', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		User.find().exec()
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
router.post('/', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var userinfo = req.body.userinfo;
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
router.post('/update', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var userinfo = req.body.userinfo;
		var tmpUser = {};
		if(userinfo.userName){
			tmpUser.username = userinfo.userName;
		}
		if(userinfo.legalName){
			tmpUser.legalname = userinfo.legalName;
		}
		if(userinfo.password){
			tmpUser.password = userinfo.password;
		}
		if(userinfo.role){
			tmpUser.role = userinfo.role;
		}
		User.update(
			{ _id : userinfo.userId },
			tmpUser,
			{},
			function(err, raw){
				var result = null;
				if(err){
					result = new Result(1, err, null);
				}
				result = new Result(0, 'save update succeeded!', null);
				res.json(result);
			}
		);
	}
);
//delete a user
router.delete('/:userId', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var userId = req.params.userId;
		User.findByIdAndRemove(userId, {}, function(err, user){
			var result;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, 'save delete succeeded!', null);
			}
			res.json(result);
		});
	}
);
router.post('/checkpassword/', //passport.authenticate('bearer', { session: false }),
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
module.exports = router;