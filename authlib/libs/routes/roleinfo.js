var _ = require('lodash');
var Role = require('../rbac/role');
var Permission = require('../rbac/permission');
var PermissionInfo = require('./permissioninfo');

var RoleInfo  = function(info){
	this.name = info.name;
	this.grants = info.grants;
};
//RoleInfo.convertFromRoles = function(roles){
//	if(!_.isArray(roles)){
//		return new RoleInfo({
//			name          : roles.name,
//			grants        : PermissionInfo.convertFromPermissions(roles.grants)
//		});
//	}
//	var arrRoleInfo = roles.map(function(role){
//		return new RoleInfo({
//			name          : role.name,
//			grants        : PermissionInfo.convertFromPermissions(roles.grants)
//		});
//	});
//	return arrRoleInfo;
//};
module.exports = RoleInfo;