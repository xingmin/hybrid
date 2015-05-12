var RBACExt  = require('./rbacext');
var RBAC  = require('./rbac');
var db = require('../db/mongoose');

var rbac = new RBACExt(
	{ 
		storage : new RBACExt.Storage.Mongoose({
			connection : db
		})
	}
);
module.exports = rbac;