var express = require('express');
var router = express.Router();
var Draw = require("../../models/opsupport/draw.js");
var DrawDetail = require("../../models/opsupport/drawdetail.js");
var Q = require('q');
var ResData = require("../resdata.js");
var momentz = require('moment-timezone');
var moment = require('moment');
var auth = require('../../authlib/index');
var _=require('lodash');

router.post('/create',
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'draw', 'opsupport'),
	function(req, res) {
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
    var barCodeRegex =/^[A-z0-9]+$/;
    var nonLegalBarcode = _.find(arrDrawDetail, function(detail){
        return !barCodeRegex.test(detail.barcode);
    });
    if (nonLegalBarcode){
        var resdata = new ResData(2, _.result(nonLegalBarcode, 'barcode')+'不是有效的条形码号!');
        resdata.sendJson(res);
        return;
    }
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

router.post('/update',
    auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'draw', 'opsupport'),
	function(req, res) {
	var id = req.body.id;
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
		'id':id,
		'consumer' : consumer,
		'receiver' : receiver,
		'remark' : remark,
		'drawer' : drawer,
		'drawTime' : localDrawTime,
		'drawDetails' : arrDrawDetail
		});
	draw.updateDrawRecord()
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

router.post('/delete',
    auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'draw', 'opsupport'),
	function(req, res) {
	var id = req.body.id;
	var draw = new Draw({id:id});
	draw.deleteDrawRecord()
		.then(
				function(status){
					var resdata;
					resdata = new ResData(0, '');
					resdata.sendJson(res);
				},
				function(status){
					var resdata;
					resdata = new ResData(status.status, status.message);
					resdata.sendJson(res);
				}
		);
});

router.get('/q',
    auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'draw', 'opsupport'),
	function(req, res) {
	var dateBegin = req.query.b;
	var dateEnd = req.query.e;
	var barcode = req.query.barcode;
	var consumer = req.query.consumer;
	var receiver = req.query.receiver;
	var pageNo = req.query.pageno;
	var pageSize = req.query.pagesize;
	
	if (!pageSize || isNaN(pageSize)) {
		pageSize = 5;
	}
	if (!pageNo || isNaN(pageNo)) {
		pageNo = 1;
	}
	var qb = new Date(dateBegin);
	var qe = new Date(dateEnd);
	
	var promise1 = Draw.prototype.getDrawRecordsPageInfo(qb, qe, barcode, consumer, receiver, pageSize);
	var promise2 = Draw.prototype.getDrawRecordsByDate(qb, qe, barcode, consumer, receiver, pageNo, pageSize);
	
	Q.all([promise1, promise2])
		.then(
				function(arrData){
					var resdata;
					resdata = new ResData(0,'',{'pageInfo':arrData[0], 'pageData': arrData[1]});
					resdata.sendJson(res);
				},
				function(data){
					var resdata;
					resdata = new ResData(data.status, data.message);
					resdata.sendJson(res);
				}
		);
});

router.get('/getdetail/:drawId',
    auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'draw', 'opsupport'),
	function(req, res) {
	var drawId = req.param('drawId');
	var draw = new Draw({id:drawId});
	draw.getDrawDetails()
		.then(
				function(data){
					var resdata;
					resdata = new ResData(0,'',data);
					resdata.sendJson(res);
				},
				function(data){
					var resdata;
					resdata = new ResData(data.status, data.message);
					resdata.sendJson(res);
				}
		);
});

module.exports = router;
