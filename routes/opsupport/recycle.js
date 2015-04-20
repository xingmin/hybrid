var express = require('express');
var router = express.Router();
var Recycle = require("../../models/opsupport/recycle.js");
var DrawDetail = require("../../models/opsupport/drawdetail.js");
var Q = require('q');
var ResData = require("../resdata.js");
var momentz = require('moment-timezone');
var moment = require('moment');

router.post('/create', function(req, res) {
	var consumer = req.body.consumer;
	var receiver = req.body.receiver;
	var remark = req.body.remark;
	var drawer = req.body.drawer;
	var drawTime = momentz.tz(new Date(),'Asia/Chongqing');
	var localDrawTime = new Date(drawTime.format('YYYY-MM-DD HH:mm:ss'));
	var drawDetails = req.body.drawDetails;
	var arrDrawDetail = drawDetails;
//	var arrDrawDetail = [];
//	if(drawDetails && drawDetails.length>0){
//		arrDrawDetail = drawDetails.map(function(drawDetail){
//			return new DrawDetail({'barcode':drawDetail.barcode});
//		});
//	}
	var draw = new Draw({
		'consumer' : consumer,
		'receiver' : receiver,
		'remark' : remark,
		'drawer' : drawer,
		'drawTime' : localDrawTime,
		'drawDetails' : arrDrawDetail
		});
	draw.saveNewDrawRecord()
		.then(
				function(status){
					var resdata;
					resdata = new ResData(0, '', draw);
					resdata.sendJson(res);
				},
				function(err){
					var resdata = new ResData(1, err.message);
					resdata.sendJson(res);
				}
		);
});

module.exports = router;
