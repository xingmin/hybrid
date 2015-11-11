define(['angular',"angular-bootstrap",'directives/maindirective', 'services/mainservice', 'oa/index'], function(angular) {
    'use strict';
    return angular.module('performance-dept', ['ui.bootstrap','webapp.directives','webapp.services', 'oa']);
});