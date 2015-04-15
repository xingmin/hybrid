var express = require('express');
var router = express.Router();
var Queue = require("../../models/queue/queue.js");
var Q = require('q');
var ResData = require("../resdata.js");


router.post('/create', function(req, res) {
	var name = req.body.name;
	var maxCallTimes = req.body.maxCallTimes;
	var queueClassId = req.body.queueClassId;
	var isActive = req.body.isActive;
	var queue = new Queue(null,name, maxCallTimes,queueClassId, null, isActive);
	queue.createNewQueue()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(1, status.message);
			}else{
				resdata = new ResData(0, '', queue);
			}
			resdata.sendJson(res);
		});
});

router.post('/update', function(req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var maxCallTimes = req.body.maxCallTimes;
	var queueClassId = req.body.queueClassId;
	var isActive = req.body.isActive;
	var queue = new Queue(id, name, maxCallTimes, queueClassId, null, isActive);
	queue.updateQueue()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(status, status.message);
			}else{
				resdata = new ResData(0, '', queue);
			}
			resdata.sendJson(res);
		});
});

router.post('/delete', function(req, res) {
	var id = req.body.id;
	var queue = new Queue(id, '');
	queue.deleteQueue()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(status.status, status.message);
			}else{
				resdata = new ResData(status.status);
			}
			resdata.sendJson(res);
		});
});
router.get('/', function(req, res) {
	Queue.prototype.getAllQueues()
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
router.get('/userqueue/detail/:userid', function(req, res) {
	var userid = req.param('userid');
	Queue.getUserAvilableQueueDetail(userid)
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
router.get('/userqueue/:userid', function(req, res) {
	var userid = req.param('userid');
	Queue.getUserAvilableQueue(userid)
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
router.post('/userqueue/update', function(req, res) {
	var userid = req.body.userid;
	var arrQueue = req.body.queueid;
	
	Queue.saveUserAvilableQueues(userid,  arrQueue)
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

router.get('/querybyclassid/:classid', function(req, res) {
	var classid = req.param('classid');
	Queue.getQueueByClassId(classid)
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
