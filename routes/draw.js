var express = require('express');
var router = express.Router();
var Draw = require("../../models/draw.js");
var Q = require('q');
var ResData = require("../resdata.js");

router.post('/create', function(req, res) {
	var receiver = req.body.receiver;
	var drawer = req.body.drawer;
	var consumer = req.body.consumer;
	var draw = new Draw({receiver:receiver, drawer:drawer, consumer:consumer});
	draw.createNewDrawRecord()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(1, status.message);
			}else{
				resdata = new ResData(0, '', draw);
			}
			resdata.sendJson(res);
		});
});

router.post('/update', function(req, res) {
	var id = req.body.id;
	var receiver = req.body.receiver;
	var drawer = req.body.drawer;
	var consumer = req.body.consumer;
	var draw = new Draw({id:id, receiver:receiver, drawer:drawer, consumer:consumer});
	draw.updateDrawRecord()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(status, status.message);
			}else{
				resdata = new ResData(0, '', draw);
			}
			resdata.sendJson(res);
		});
});

router.post('/delete', function(req, res) {
	var id = req.body.id;
	var draw = new Draw({id:id});
	draw.deleteDrawRecord()
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

router.get('/q', function(req, res) {
	var dateBegin = req.query.b;
	var dateEnd = req.query.e;
	Draw.prototype.getDrawRecordsByDate(dateBegin, dateEnd)
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
