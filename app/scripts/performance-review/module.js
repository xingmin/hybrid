define(['angular', "ng-file-upload",'directives/maindirective'], function(angular) {
    'use strict';
    return angular.module('performance', ['ngFileUpload','webapp.directives']);
});