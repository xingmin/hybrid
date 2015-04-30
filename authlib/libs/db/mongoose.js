var path = require('path');
var mongoose = require('mongoose');

var libs = path.resolve(__dirname, '../..')  + '/libs/';

var log = require('../../../log')(module);
var config = require(libs + 'config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback () {
	log.info("Connected to DB!");
});

module.exports = mongoose;