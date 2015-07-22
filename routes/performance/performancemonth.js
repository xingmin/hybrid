var express = require('express');
var router = express.Router();
var Q = require('q');
var Result = require("../result.js");
var auth = require('../../authlib/index');
var _=require('lodash');
var PerformanceMonth = require('../../models/performance/performancemonth');

router.get('/',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'list', 'performance'),
    function(req, res) {
        var minMonth = req.query.minMonth;
        var minYear = req.query.minYear;
        var maxYear = req.query.maxYear;
        var maxMonth = req.query.maxMonth;
        var pageNo = req.query.pageNo;
        var pageSize = req.query.pageSize;
        PerformanceMonth.getPerformanceMonthByCriterial(pageNo, pageSize, minYear, minMonth, maxYear, maxMonth).then(
            function(arrData){
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
        var year = req.body.year;
        var month = req.body.month;
        var  performanceMonth= new PerformanceMonth({
            'year' : year,
            'month' : month
        });
        performanceMonth.saveNew()
            .then(
            function(status){
                (new Result(0, "", performanceMonth)).json(res);

            },
            function(err){
                (new Result(1, err.message)).json(res);
            }
        );
    });

router.delete('/:monthid',
    auth.passport.authenticate('bearer', { session: false }),
    //auth.RBACMidware.can(auth.rbac, 'delete', 'performance'),
    function(req, res) {
        var monthid = req.params.monthid;
        var performanceMonth = new PerformanceMonth({monthId:monthId});
        performanceMonth.delete().then(
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