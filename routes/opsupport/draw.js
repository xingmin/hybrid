var express = require('express');
var router = express.Router();
var Draw = require("../../models/opsupport/draw.js");
var Q = require('q');
var ResData = require("../resdata.js");
var momentz = require('moment-timezone');
var moment = require('moment');

router.post('/create', function(req, res) {
	var barcode = req.body.barcode;
	var receiver = req.body.receiver;
	var drawer = req.body.drawer;
	
	var drawTime = momentz.tz(new Date(),'Asia/Chongqing');
	var localDrawTime = new Date(drawTime.format('YYYY-MM-DD HH:mm:ss'));
	var consumer = req.body.consumer;
	
	var remark = req.body.remark;

	var draw = new Draw({
	    'barcode' : barcode,
	    'receiver' : receiver,
	    'drawer' : drawer,
	    'drawTime' : localDrawTime,
	    'consumer' : consumer,
	    'useFlag' : 0,
	    'recyler' : '',
	    'recyleTime' : null,
	    'remark' : remark,
	    'photo' : null
		});
	draw.saveNewDrawRecord()
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
	var barcode = req.body.barcode;
	var receiver = req.body.receiver;
	var drawer = req.body.drawer;	
	var drawTime = momentz.tz(new Date(),'Asia/Chongqing');
	var localDrawTime = new Date(drawTime.format('YYYY-MM-DD HH:mm:ss'));
	var consumer = req.body.consumer;
	var useFlag = req.body.useFlag;
	var recyler = req.body.recyler;
	var recyleTime = new Date();
	var remark = req.body.remark;
	
	var draw = new Draw({
		'id':id,
	    'barcode' : barcode,
	    'receiver' : receiver,
	    'drawer' : drawer,
	    'drawTime' : localDrawTime,
	    'consumer' : consumer,
	    'useFlag' : 0,
	    'recyler' : '',
	    'recyleTime' : null,
	    'remark' : remark,
	    'photo' : null
	});
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
				resdata = new ResData(0);
			}
			resdata.sendJson(res);
		});
});

router.get('/q', function(req, res) {
	var dateBegin = req.query.b;
	var dateEnd = req.query.e;
	var qb = new Date(dateBegin);
	var qe = new Date(dateEnd);
	console.log(qb);
	console.log(qe);
	Draw.prototype.getDrawRecordsByDate(qb, qe)
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
