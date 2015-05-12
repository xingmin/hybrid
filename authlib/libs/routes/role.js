var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var libs = path.resolve(__dirname, '../..')+ '/libs/';

var Result = require('./result');
var PermissionInfo = require('./permissioninfo');
var RoleInfo = require('./roleinfo');
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
router.post('/:role/grant/', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var permInfo = req.body.permissionInfo;
		var role  = rbac.createRole(req.params.role, false, function(){});
		var permission = rbac.createPermission(permInfo.action, permInfo.resource, false, function(){});
		rbac.grant(role, permission, function(err){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, 'grant permission to role succeeded!', null);
			}
			res.json(result);
		});
	}
);

//revoke permission from role
router.post('/:role/revoke/', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var permInfo = req.body.permissionInfo;
		var role  = rbac.createRole(req.params.role, false, function(){});
		var permission = rbac.createPermission(permInfo.action, permInfo.resource, false, function(){});
		rbac.revoke(role, permission, function(err){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, 'revoke permission from role succeeded!', null);
			}
			res.json(result);
		});
	}
);

//get role's grants list
router.get('/:role/grants/', //passport.authenticate('bearer', { session: false }),
	function(req, res) {
		var roleName = req.params.role;
		rbac.getScopeExt(roleName, function(err, grants){
			var result = null;
			if(err){
				result = new Result(1, err, null);
			}else{
				result = new Result(0, '', PermissionInfo.convertFromPermissions(grants));
			}
			res.json(result);
		});
	}
);


module.exports = router;