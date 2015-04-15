var express = require('express');
var router = express.Router();
var QueueStatus = require("../../models/queue/queuestatus.js");
var Q = require('q');
var ResData = require("../resdata.js");

router.get('/queuestatus/', function(req, res) {
	QueueStatus.getAllStatus()
		.then(function(data){
			var resdata;
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0,'',data);
			}
			resdata.sendJson(res);
		});
});
module.exports = router;
