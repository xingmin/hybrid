var express = require('express');
var router = express.Router();
var Recycle = require("../../models/opsupport/recycle.js");
var RecycleDetail = require("../../models/opsupport/drawdetail.js");
var Q = require('q');
var ResData = require("../resdata.js");
var Result = require("../result.js");
var momentz = require('moment-timezone');
var moment = require('moment');
var auth = require('../../authlib/index');

router.post('/create',
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'recycle', 'opsupport'),
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
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'recycle', 'opsupport'),
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
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'recycle', 'opsupport'),
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
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'recycle', 'opsupport'),
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

router.get('/',
	auth.passport.authenticate('bearer', { session: false }),
	//auth.RBACMidware.can(auth.rbac, 'recycle', 'opsupport'),
	function(req, res) {
		var dateBegin = req.query.b;
		var dateEnd = req.query.e;
		var barcode = req.query.barcode;
		var returner = req.query.returner;
		var recycler = req.query.recycler;
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

		var promise1 = Recycle.prototype.getRecyclesPageInfo(qb, qe, barcode, returner, recycler, pageSize);
		var promise2 = Recycle.prototype.getRecyclesByCriterial(qb, qe, barcode, returner, recycler, pageNo, pageSize);

		Q.all([promise1, promise2])
			.then(
			function(arrData){
				if(arrData) console.log('xx');
				(new Result(0,'',{'pageInfo':arrData[0], 'pageData': arrData[1]})).json(res);
			},
			function(data){
				(new Result(data.status, data.message)).json(res);
			}
		);
	});
router.delete('/:id',
	auth.passport.authenticate('bearer', { session: false }),
	//auth.RBACMidware.can(auth.rbac, 'draw', 'opsupport'),
	function(req, res) {
		var id = req.params.id;
		var recycle = new Recycle({id:id});
		recycle.deleteRecycle().then(
			function(status){
				(new Result(0, '')).json(res);
			},
			function(status){
				(new Result(status.status, status.message)).json(res);
			}
		);
	});
module.exports = router;
