var express = require('express');
var router = express.Router();
var Q = require('q');
var Result = require("../result.js");
var moment = require('moment');
var auth = require('../../authlib/index');
var BarCode = require('../../models/external/barcode');
var HisUser = require('../../models/external/hisuser');
var HisDept = require('../../models/external/hisdept');
var _ = require('lodash');

router.get('/barcode/getchargeinfo',
    auth.passport.authenticate('bearer', { session: false }),
    auth.RBACMidware.can(auth.rbac, 'query-barcode-info', 'external-his'),
    function(req, res) {
        var barCode = req.query.barcode;
        BarCode.getChargeInfoByBarCode(barCode).then(
            function(data){
                (new Result(0,'',data)).json(res);
            },
            function(data){
                (new Result(1, data.message, null)).json(res);
            }
        );
    });
router.get('/barcode/',
    auth.passport.authenticate('bearer', { session: false }),
    auth.RBACMidware.can(auth.rbac, 'query-barcode-info', 'external-his'),
    function(req, res) {
        var qstart = new Date(req.query.qstart);
        var qend = new Date(req.query.qend);
        var barCode = req.query.barcode;
        var inpatientNo = req.query.inpatientno;
        var times = parseInt(req.query.times);
        times = _.isNaN(times)?0:times;
        var pageNo = parseInt(req.query.pageno);
        var pageSize = parseInt(req.query.pagesize);
        BarCode.getChargeInfoList(qstart, qend, barCode, inpatientNo, times, pageNo, pageSize).then(
            function(data){
                (new Result(0,'',data)).json(res);
            },
            function(data){
                (new Result(1, data.message, null)).json(res);
            }
        );
    });
router.get('/barcode/count',
    auth.passport.authenticate('bearer', { session: false }),
    auth.RBACMidware.can(auth.rbac, 'query-barcode-info', 'external-his'),
    function(req, res) {
        var qstart = new Date(req.query.qstart);
        var qend = new Date(req.query.qend);
        var barCode = req.query.barcode;
        var inpatientNo = req.query.inpatientno;
        var times = parseInt(req.query.times);
        times = _.isNaN(times)?0:times;
        BarCode.getChargeInfoCount(qstart, qend, barCode, inpatientNo, times).then(
            function(data){
                (new Result(0,'',data)).json(res);
            },
            function(data){
                (new Result(1, data.message, null)).json(res);
            }
        );
    }
);
router.get('/user/',
    auth.passport.authenticate('bearer', { session: false }),
    auth.RBACMidware.can(auth.rbac, 'list', 'external-his'),
    function(req, res) {
        var unit = req.query.unit || '';
        HisUser.getHisUserList(unit).then(
            function(users){
                (new Result(0, "", users)).json(res);
            },
            function(err){
                (new Result(1, err.message, null)).json(res);
            }
        );
    }
);
router.get('/dept/',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'list-dept', 'external-his'),
    function(req, res) {
        HisDept.getHisDeptList().then(
            function(depts){
                (new Result(0, "", depts)).json(res);
            },
            function(err){
                (new Result(1, err.message, null)).json(res);
            }
        );
    }
);
module.exports = router;