module.exports = function(app){
	var home = require('./home');
	var draw = require('./opsupport/draw');
	var recycle = require('./opsupport/recycle');
	var auth = require('../authlib/initauth');
    var oproom = require('./opsupport/oproom');
	var his = require('./external/his');
	var oa = require('./external/oa');
	var barcode = require('./opsupport/barcode');
	//var performanceDept = require('./performance/performancedept');
	//var performanceMonth = require('./performance/performancemonth');

	auth(app);
	app.use('/', home);
	app.use('/opsupport/draw', draw);
	app.use('/opsupport/recycle', recycle);
    app.use('/opsupport/oprooms', oproom);
	app.use('/his', his);
	app.use('/oa', oa);
	app.use('/barcode', barcode);
	//app.use('/performance/dept', performanceDept);
	//app.use('/performance/month', performanceMonth);

}
