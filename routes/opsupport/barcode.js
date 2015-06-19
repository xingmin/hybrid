var express = require('express');
var router = express.Router();
var DrawDetail = require("../../models/opsupport/drawdetail.js");
var Q = require('q');
var Result = require("../result.js");
var auth = require('../../authlib/index');
var _=require('lodash');

router.get('/:barcode/status',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'draw', 'opsupport'),
    function(req, res) {
        var barcode = req.param('barcode');
        DrawDetail.getBarCodeStatus(barcode).then(
            function(data){
                (new Result(0,"" , data)).json(res);
            },
            function(err){
                (new Result(1, err.message, null)).json(res);
            }
        );
    });
module.exports = router;