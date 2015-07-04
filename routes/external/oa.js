var express = require('express');
var router = express.Router();
var Q = require('q');
var Result = require("../result.js");
var moment = require('moment');
var auth = require('../../authlib/index');
var OADept = require('../../models/external/oadept');
var _ = require('lodash');

router.get('/dept/',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'list-dept', 'external-oa'),
    function(req, res) {
        OADept.getOADeptList().then(
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