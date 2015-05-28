var path = require('path');
var mongoose = require('mongoose');

var log = require('../log')(module);
var config = require('../authlib/config');

var db = mongoose.createConnection('localhost','apiDB');

db.on('error', function (err) {
	log.error('2 Connection error:', err.message);
});

db.once('open', function callback () {
	log.info("2 Connected to DB!");
});
module.exports = db;