var express = require('express');
var router = express.Router();
var QueueClass = require("../../models/queue/queueclass.js");
var Q = require('q');
var ResData = require("../resdata.js");


router.post('/create', function(req, res) {
	var name = req.body.classname;
	var mode = req.body.classmode;
	var py = req.body.pinyin;
	var externalSysId = req.body.externalSysId;
	var queueclass = new QueueClass(null, name, mode, py, externalSysId);
	queueclass.createNewQueueClass()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(1, status.message);
			}else{
				resdata = new ResData(0, '', queueclass);
			}
			resdata.sendJson(res);
		});
});

router.post('/update', function(req, res) {
	var name = req.body.classname;
	var id = req.body.classid;
	var mode = req.body.classmode;
	var py = req.body.pinyin;
	var externalSysId = req.body.externalSysId;
	var queueclass = new QueueClass(id, name, mode, py, externalSysId);
	queueclass.updateQueueClass()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(status, status.message);
			}else{
				resdata = new ResData(0, '', queueclass);
			}
			resdata.sendJson(res);
		});
});

router.post('/delete', function(req, res) {
	var id = req.body.classid;
	var queueclass = new QueueClass(id);
	queueclass.deleteQueueClass()
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
	QueueClass.prototype.getAllQueueClass()
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

router.get('/get/py/:py', function(req, res) {	
	var pinyin = req.param('py');
	QueueClass.prototype.getQueueClassByPinyin(pinyin)
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
