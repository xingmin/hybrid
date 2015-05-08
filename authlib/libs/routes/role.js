var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var libs = path.resolve(__dirname, '../..')+ '/libs/';

var Result = require('./result');
var PermissionInfo = require('./roleinfo');
var RoleInfo = require('./roleinfo');
var RBAC = require('../rbac/index');
var rbac = require('../rbac/initrbac');

//get role list
router.get('/', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		rbac.getRoles(function(err, roles){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, '', RoleInfo.convertFromRoles(roles));
			}
			res.json(result);
		});
	}
);

//create new role
router.post('/', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var roleInfo = req.body.roleInfo;
		rbac.createRole(roleInfo.name, true,
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
//delete role
router.post('/delete', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var roleInfo = req.body.roleInfo;
		rbac.removeByName(roleInfo.name, function(err){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, roleInfo.name+'delete succeeded!', null);
			}
			res.json(result);
		});
	}
);


//grant permission to role
router.post('/grant', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var info = req.body.info;
		var roleInfo = info.roleInfo;
		var permInfo = info.permissionInfo;
		var role  = rbac.createRole(roleInfo.name, false, function(){});
		var permission = rbac.createPermission(permInfo.action, permInfo.resource, false, function(){});
		rbac.grant(role, permission, function(err){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, roleInfo.name+'delete succeeded!', null);
			}
			res.json(result);
		});
	}
);



module.exports = router;