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
var xlsx = require('node-xlsx');
var PerformanceDept = require('../../models/performance/performance');

router.post('/:month/upload',
    //auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'upload', 'performance'),
    function(req, res) {
        var yearmonth = req.params.month;
        var tmpdir = path.resolve(__dirname, '../../tmp')+"/";
        var form = new multiparty.Form({uploadDir: tmpdir});
        form.parse(req, function(err, fields, files) {
            if(err){
                console.log('parse error: ' + err);
                (new Result(1, err.message, null)).json(res);
                return;
            }
            var obj = xlsx.parse(files.file[0].path);
            console.log(JSON.stringify(obj));
        });
    });
router.get('/',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'list', 'performance'),
    function(req, res) {
        var py = req.query.py;
        py = py || '';
        PerformanceDept.getPerformanceDepts(py).then(
            function(arrData){
                if(arrData) console.log('xx');
                (new Result(0,'',arrData)).json(res);
            },
            function(data){
                (new Result(data.status, data.message)).json(res);
            }
        );
    }
);
router.post('/',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'create', 'performance'),
    function(req, res) {
        var deptName = req.body.deptName;
        var pinYin = req.body.pinYin;
        var OAEmpId = req.body.OAEmpId;

        var  performanceDept= new PerformanceDept({
            'deptName' : deptName,
            'pinYin' : pinYin,
            'OAEmpId' : OAEmpId
        });
        performanceDept.saveNew()
            .then(
            function(status){
                (new Result(0, "", performanceDept)).json(res);

            },
            function(err){
                (new Result(1, err.message)).json(res);
            }
        );
    });
router.put('/',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'update', 'performance'),
    function(req, res) {
        var deptId = req.body.deptId;
        var deptName = req.body.deptName;
        var pinYin = req.body.pinYin;
        var OAEmpId = req.body.OAEmpId;

        var  performanceDept= new PerformanceDept({
            'deptId' : deptId,
            'deptName' : deptName,
            'pinYin' : pinYin,
            'OAEmpId' : OAEmpId
        });
        performanceDept.saveUpdate()
            .then(
            function(status){
                (new Result(0, "", performanceDept)).json(res);

            },
            function(err){
                (new Result(1, err.message)).json(res);
            }
        );
    });
router.delete('/:deptid',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'delete', 'performance'),
    function(req, res) {
        var deptid = req.params.deptid;
        var performanceDept = new PerformanceDept({deptId:deptid});
        performanceDept.deletePerformanceDept().then(
            function(status){
                (new Result(0, '')).json(res);
            },
            function(status){
                (new Result(status.status, status.message)).json(res);
            }
        );
    }
);
module.exports = router;