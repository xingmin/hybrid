var util = require('util');
var RBAC = require('./index');
var Permission = require("./permission");

function extend(target, source) {
    for(var key in source) {
        if (source.hasOwnProperty(key) && key !== 'prototype') {
            target[key] = source[key];
        }
    }
}
var RBACExt = function(options, callback){
	RBAC.call(this, options, callback);
};
extend(RBACExt, RBAC);
util.inherits(RBACExt, RBAC);
RBACExt.prototype.remove = function(item, cb){
	var self = this;
	var permname = null;
	if (RBAC.isPermission(item)) {
		permname = RBACExt.Permission.createName(item.action, item.resource);
	}else if(RBAC.isRole(item)){
		permname = item.name;
	}else{
		RBAC.prototype.remove.call(this, item, cb);
	}
	this.storage.model.findOne({ "grants": { "$in" : [permname] } }, function (err, record) {
		if (err) {
			return cb(err);
		}
		if (!record) {
			return RBAC.prototype.remove.call(self, item, cb);
		}
		cb(new Error('permission were granted to the others, cannot be deleted.'));
	});
};
RBACExt.prototype.removeByName = function(name, cb){
	var self = this;
	this.storage.model.findOne({ "grants": { "$in" : [name] } }, function (err, record) {
		if (err) {
			return cb(err);
		}
		if (!record) {
			return RBAC.prototype.removeByName.call(self, name, cb);
		}
		cb(new Error('permission were granted to the others, cannot be deleted.'));
	});
};
RBACExt.prototype.getScopeExt = function(roleName, cb){
	var scope = [];
	
	//traverse hierarchy
	this._traverseGrants(roleName, function (err, item) {
		//if there is a error
		if (err) {
			return cb(err);
		}

		//this is last item
		if (!item) {
			return cb(null, scope);
		}

		if (RBAC.isPermission(item) && scope.indexOf(item.name) === -1) {
			scope.push(item);
		}
	});

	return this;
};
module.exports = RBACExt;