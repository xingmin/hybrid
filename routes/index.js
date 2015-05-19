module.exports = function(app){
	var home = require('./home');
	var draw = require('./opsupport/draw');
	var recycle = require('./opsupport/recycle');
	var auth = require('../authlib/libs/initauth');
	auth(app);
	app.use('/', home);
	app.use('/opsupport/draw', draw);
	app.use('/opsupport/recycle', recycle);
	
}
