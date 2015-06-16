var express = require('express');
var router = express.Router();
var Q = require('q');
var Result = require("../result.js");
var moment = require('moment');
var auth = require('../../authlib/index');
var BarCode = require('../../models/external/barcode');
var HisUser = require('../../models/external/hisuser');

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
router.get('/user/',
    auth.passport.authenticate('bearer', { session: false }),
    auth.RBACMidware.can(auth.rbac, 'list', 'external-his'),
    function(req, res) {
        HisUser.getHisUserList().then(
            function(users){
                (new Result(0, "", users)).json(res);
            },
            function(err){
                (new Result(1, err.message, null)).json(res);
            }
        );
    }
);
module.exports = router;