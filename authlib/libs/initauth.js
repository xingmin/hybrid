var addAuth = function(app){
	var path = require('path');
	var passport = require('passport');
	var methodOverride = require('method-override');
	
	var libs = path.resolve(__dirname, '../..')  + '/authlib/libs/';
	require(libs + 'auth/auth');	
	
	var oauth = require('./routes/oauth');
	
	var api = require('./routes/api');
	var users = require('./routes/users');
	
	app.use(methodOverride());
	app.use(passport.initialize());
	
	app.use('/authapi', api);
	app.use('/authapi/users', users);
	app.use('/authapi/oauth', oauth);
};

module.exports = addAuth;