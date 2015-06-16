module.exports = function(app){
	var home = require('./home');
	var draw = require('./opsupport/draw');
	var recycle = require('./opsupport/recycle');
	var auth = require('../authlib/initauth');
    var oproom = require('./opsupport/oproom');
	var his = require('./external/his');

	auth(app);
	app.use('/', home);
	app.use('/opsupport/draw', draw);
	app.use('/opsupport/recycle', recycle);
    app.use('/opsupport/oprooms', oproom);
	app.use('/his', his);
}
