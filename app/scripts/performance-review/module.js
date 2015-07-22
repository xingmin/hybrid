define(['angular',"angular-bootstrap",'directives/maindirective', 'services/mainservice', '../oa/index', '../common/datedropdowndirective', './performancedirective'], function(angular) {
    'use strict';
    return angular.module('performance', ['ui.bootstrap','webapp.directives','webapp.services', 'oa', 'common.date', 'performance.month']);
});