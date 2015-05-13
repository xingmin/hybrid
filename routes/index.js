module.exports = function(app){
	var home = require('./home');
	var users = require('./users');
	var patient = require('./patient');
	var depts = require('./depts');
	var queueclass = require('./queue/queueclass');
	var queue = require('./queue/queue');
	var externalsys = require('./queue/externalsys');
	var ticket = require('./queue/ticket');
	var dict = require('./queue/dict');
	var person = require('./queue/person');
	var draw = require('./opsupport/draw');
	var recycle = require('./opsupport/recycle');
	var auth = require('../authlib/libs/initauth');

	app.use('/', home);
	app.use('/users', users);
	app.use('/patient', patient);
	app.use('/depts', depts);
	app.use('/queue/queueclass', queueclass);
	app.use('/queue/queue', queue);
	app.use('/queue/window', require('./queue/window'));
	app.use('/queue/user', require('./queue/user'));
	app.use('/queue/externalsys', externalsys);
	app.use('/queue/ticket', ticket);
	app.use('/dict', dict);
	app.use('/queue/person', person);

	app.use('/opsupport/draw', draw);
	app.use('/opsupport/recycle', recycle);
	
	auth(app);
}
