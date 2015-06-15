var express = require('express');
var router = express.Router();
var Q = require('q');
var Result = require("./result.js");
var momentz = require('moment-timezone');
var moment = require('moment');
var auth = require('../authlib/index');
var BarCode = require('../models/barcode');

router.get('/hisuser/',
	auth.passport.authenticate('bearer', { session: false }),
	//auth.RBACMidware.can(auth.rbac, 'query-barcode-info', 'his'),
	function(req, res) {

	});
module.exports = router;