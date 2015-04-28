var nconf = require('nconf');

nconf.argv()
	.env()
	.file({
		file: process.cwd() + '/authlib/config.json'
	});

module.exports = nconf;