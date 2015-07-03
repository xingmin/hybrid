var express = require('express');
var router = express.Router();
var Q = require('q');
var Result = require("../result.js");
var auth = require('../../authlib/index');
var _=require('lodash');

router.put('/:month/upload',
    auth.passport.authenticate('bearer', { session: false }),
    auth.RBACMidware.can(auth.rbac, 'upload', 'performance'),
    function(req, res) {

    });
module.exports = router;