define(['angular',"angular-bootstrap", "ng-file-upload",'directives/maindirective', 'services/mainservice', '../oa/index', '../common/datedropdowndirective'], function(angular) {
    'use strict';
    return angular.module('performance', ['ui.bootstrap','ngFileUpload','webapp.directives','webapp.services', 'oa', 'common.date']);
});