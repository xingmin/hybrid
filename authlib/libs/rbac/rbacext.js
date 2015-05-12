var util = require('util');
var RBAC = require('./index');

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