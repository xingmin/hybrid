var addAuth = function(app){
	var path = require('path');
	var passport = require('passport');
	var methodOverride = require('method-override');
	
	var libs = path.resolve(__dirname)+"/";
	var db = require(libs + 'db/mongoose');
	//var db = require('./rbac/init-rbac-storage');
	require(libs + 'auth/auth');	
	
	var oauth = require('./routes/oauth');
	
	var api = require('./routes/api');
	var users = require('./routes/users');
	var role = require('./routes/role');
	var permission = require('./routes/permission');
	
	app.use(methodOverride());
	app.use(passport.initialize());
	
	app.use('/authapi', api);
	app.use('/authapi/users', users);
	app.use('/authapi/permission', permission);
	app.use('/authapi/roles', role);
	app.use('/authapi/oauth', oauth);
};

module.exports = addAuth;