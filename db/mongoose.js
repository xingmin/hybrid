var path = require('path');
var mongoose = require('mongoose');

var log = require('../log')(module);
var config = require('../authlib/config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;
db.on('error', function (err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback () {
	log.info("Connected to DB 2!");
});
module.exports = db;