var express = require('express');
var router = express.Router();
var Q = require('q');
var ResData = require("../resdata.js");
var momentz = require('moment-timezone');
var moment = require('moment');
var auth = require('../../authlib/index');
var BarCode = require('../../models/opsupport/barcode');

router.get('/barcode/getchargeinfo',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'query-barcode-info', 'his'),
    function(req, res) {
        var barCode = req.query.barcode;
        BarCode.getChargeInfoByBarCode(barCode).then(
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