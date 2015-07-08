var express = require('express');
var router = express.Router();
var OAEmp = require("../../models/external/oaemp");
var Q = require('q');
var Result = require("../result.js");
var auth = require('../../authlib/index');
var _=require('lodash');

router.get('/emp/',
    //auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'list-dept', 'external-oa'),
    function(req, res) {
        OAEmp.getOAEmpList().then(
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