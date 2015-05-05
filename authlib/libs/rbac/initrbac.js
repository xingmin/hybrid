var RBAC = require('./index');
var db = require('../db/mongoose');

var rbac = new RBAC(
		{ 
			storage : new RBAC.Storage.Mongoose({
				connection : db
			})
		}
	);
module.exports = rbac;