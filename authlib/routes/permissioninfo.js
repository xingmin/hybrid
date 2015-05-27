var _ = require('lodash');
var Permission = require('../rbac/permission');

var PermissionInfo  = function(info){
	this.action = info.action;
	this.resource = info.resource;
};
PermissionInfo.convertFromPermissions = function(permissions){
	if(!_.isArray(permissions)){
		return new PermissionInfo({
			action          : permissions.action,
			resource        : permissions.resource
		});
	}
	var arrPermissionInfo = permissions.map(function(permission){
		return new PermissionInfo({
			action          : permission.action,
			resource        : permission.resource
		});
	});
	return arrPermissionInfo;
};
module.exports = PermissionInfo;