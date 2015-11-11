define(['angular', './performance-month-directive', 'performance-month-service', 'performance-month-ctrl', 'common/datedropdowndirective'], function(angular) {
    'use strict';
    return angular.module("performance.month", ["performance.month.directive", "performance.month.service", "performance.month.controller", 'common.date']);
});