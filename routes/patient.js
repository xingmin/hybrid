var express = require('express');
var router = express.Router();
var patient = require("../models/patient.js");

//router.param('id', /^\d{10}$/);
router.get('/queryconsume/:id', function(req, res) {
  //res.setHeader('Content-Type','application/json;charset=utf-8');
  var patientid = req.param('id');
  console.log(patientid);
  if (! /^\d{10}$/.test(patientid)){
        console.log("wrong id");
  	return;
  }
  
  patient.getTodayConsume(patientid, function(err, recordset){
	res.setHeader('Content-Type','application/json;charset=utf-8');
	var pat = { 'id':recordset[0][0].patid
		,'name':recordset[0][0].patname
		,'total':recordset[0][0].consume
		,'currdate':recordset[0][0].currdate}
	console.log(pat);
	res.send(JSON.stringify(pat));
  });
});

module.exports = router;
