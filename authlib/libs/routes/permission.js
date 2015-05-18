var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var libs = path.resolve(__dirname, '../..')+ '/libs/';

var Result = require('./result');
var PermissionInfo = require('./permissioninfo');
var RBAC = require('../rbac/index');
var rbac = require('../rbac/initrbac');
var RBACMidware = require('../rbac/rbacmidware');
//get permission list
router.get('/',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'list', 'permission'),
	function(req, res) {
		rbac.getPermissions(function(err, permissions){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, '', PermissionInfo.convertFromPermissions(permissions));
			}
			res.json(result);
		});
	}
);

//create new permission
router.post('/',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'create', 'permission'),
	function(req, res) {
		var permissionInfo = req.body.permissionInfo;
		rbac.createPermission(permissionInfo.action, permissionInfo.resource, true,
			function(err){
				var result = null;
				if(err){
					result = new Result(1, err, null);
				}else{
					result = new Result(0, 'save succeeded!', null);
				}
				res.json(result);
			});
	}
);
//delete permission
router.post('/delete',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'delete', 'permission'),
	function(req, res) {
		var permInfo = req.body.permissionInfo;
		var permname = RBAC.Permission.createName(permInfo.action, permInfo.resource);
		rbac.removeByName(permname, function(err){
			var result = null;
			if(err){
				result = new Result(1, err.message, null);
			}else{
				result = new Result(0, permname+'delete succeeded!', null);
			}
			res.json(result);
		});
	}
);


module.exports = router;