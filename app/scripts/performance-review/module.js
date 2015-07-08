define(['angular', "ng-file-upload",'directives/maindirective', 'services/mainservice',, '../oa/index'], function(angular) {
    'use strict';
    return angular.module('performance', ['ngFileUpload','webapp.directives','webapp.services', 'oa']);
});