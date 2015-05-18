var express = require('express');
var router = express.Router();
var Recycle = require("../../models/opsupport/recycle.js");
var RecycleDetail = require("../../models/opsupport/drawdetail.js");
var Q = require('q');
var ResData = require("../resdata.js");
var momentz = require('moment-timezone');
var moment = require('moment');
var passport = require('passport');
var rbac = require('../../authlib/libs/rbac/initrbac');
var RBACMidware = require('../../authlib/libs/rbac/rbacmidware');

router.post('/create',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'recycle', 'opsupport'),
	function(req, res) {
	var returner = req.body.returner;
	var recycler = req.body.recycler;
	var remark = req.body.remark;
	var drawTime = momentz.tz(new Date(),'Asia/Chongqing');
	var localDrawTime = new Date(drawTime.format('YYYY-MM-DD HH:mm:ss'));
	var recycleDetails = req.body.recycleDetails;
	var arrRecycleDetail = recycleDetails;
//	var arrDrawDetail = [];
//	if(drawDetails && drawDetails.length>0){
//		arrDrawDetail = drawDetails.map(function(drawDetail){
//			return new DrawDetail({'barcode':drawDetail.barcode});
//		});
//	}
	var recycle = new Recycle({
		'returner' : returner,
		'recycler' : recycler,
		'remark' : remark,
		'returnTime' : localDrawTime,
		'recycleTime' : localDrawTime,
		'recycleDetails' : arrRecycleDetail
		});
	recycle.saveNewRecycle()
		.then(
				function(status){
					var resdata;
					resdata = new ResData(0, '', recycle);
					resdata.sendJson(res);
				},
				function(err){
					var resdata = new ResData(1, err.message);
					resdata.sendJson(res);
				}
		);
});

router.get('/:id',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'recycle', 'opsupport'),
	function(req, res) {
	var recyleId = req.param('id');
	var recyle = new Recycle({});
	recyle.init(recyleId)
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

router.get('/detail/:recycleid',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'recycle', 'opsupport'),
	function(req, res) {
	var recyleId = req.param('recycleid');
	Recycle.prototype.getRecycleDetailsByRecycleId(recyleId)
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

router.post('/',
	passport.authenticate('bearer', { session: false }),
	RBACMidware.can(rbac, 'recycle', 'opsupport'),
	function(req, res) {
	var arrRecycleId = req.body.arrRecycleId;
	Recycle.getRecyclesByRecycleIds(arrRecycleId)
		.then(
				function(data){
					var resdata;
					resdata = new ResData(0, '', data.value);
					resdata.sendJson(res);
				},
				function(err){
					var resdata = new ResData(1, err.message);
					resdata.sendJson(res);
				}
		);
});
module.exports = router;
