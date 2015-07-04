define(['angular', "ng-file-upload",'directives/maindirective', '../oa/index'], function(angular) {
    'use strict';
    return angular.module('performance', ['ngFileUpload','webapp.directives', 'oa']);
});