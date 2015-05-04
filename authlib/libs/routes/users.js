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
			}
			result = new Result(0, 'save succeeded!',  UserInfo.convertFromUsers(user));
			res.json(result);
		});
	}
);
//update user
router.post('/update', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var userinfo = req.body.userinfo;
		User.update(
			{ _id : userinfo.userId },
			{ 
				username  : userinfo.userName,
				legalname : userinfo.legalName,
				password  : userinfo.password
			},
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
module.exports = router;