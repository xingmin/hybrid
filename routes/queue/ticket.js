var express = require('express');
var router = express.Router();
var Ticket = require("../../models/queue/ticket.js");
var Q = require('q');
var ResData = require("../resdata.js");

router.get('/queuing/queueid/:queueid', function(req, res) {
	var queueid = req.param('queueid');
	Ticket.getQueuingTicketByQueueId(queueid)
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
