//var nconf = require('nconf');
//var path = require('path');
//
//nconf.argv()
//	.env()
//	.file({
//		file: path.resolve(__dirname, './') + '/config.json'
//	});

//var nconf = require('nconf');
//var path = require('path');
var nconf=require('../models/config');

module.exports = nconf;