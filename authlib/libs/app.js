var addAuth = function(app){	
	var path = require('path');
	var passport = require('passport');
	var methodOverride = require('method-override');

	var libs = process.cwd() + '/authlib/libs/';
	require(libs + 'auth/auth');

	
	var oauth2 = require('./auth/oauth2');

	var api = require('./routes/api');
	var users = require('./routes/users');
	
	app.use(methodOverride());
	app.use(passport.initialize());
	
	app.use('/authapi', api);
	app.use('/authapi/users', users);
	app.use('/authapi/oauth/token', oauth2.token);
};

module.exports = addAuth;