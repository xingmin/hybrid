define(['angular',  'services/mainservice', 'directives/message'], function(angular) {
    'use strict';
    return angular.module('webapp.directives', ['webapp.services', 'webapp.filters', 'ui.bootstrap', 'my.message']);
 });