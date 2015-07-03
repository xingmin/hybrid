var express = require('express');
var router = express.Router();
var Q = require('q');
var Result = require("../result.js");
var auth = require('../../authlib/index');
var _=require('lodash');
var multiparty = require('multiparty');
var fs = require('fs');
//var util = require('util');
var path = require('path');

router.post('/:month/upload',
    //auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'upload', 'performance'),
    function(req, res) {
        var yearmonth = req.params.month;
        var tmpdir = path.resolve(__dirname, '../../tmp')+"/";
        var form = new multiparty.Form({uploadDir: tmpdir});
        form.parse(req, function(err, fields, files) {
            if (err) {
                console.log('parse error: ' + err);
            } else {
            }
        });
    });
module.exports = router;