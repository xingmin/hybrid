var express = require('express');
var router = express.Router();
var Person = require("../../models/queue/person.js");
var Q = require('q');
var ResData = require("../resdata.js");

router.get('/:personid', function(req, res) {
	var personId = req.param('personid');
	var person = new Person();
	person.initByPersonId(personId)
		.then(
				function(data){
					var resdata;
					resdata = new ResData(0,'',data);
					resdata.sendJson(res);
				},
				function(err){
					var resdata;
					resdata = new ResData(1, err.message);
					resdata.sendJson(res);
				}
		);
});
module.exports = router;
