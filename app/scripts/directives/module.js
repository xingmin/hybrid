define(['angular',  'services/mainservice'], function(angular) {
    'use strict';
    return angular.module('webapp.directives', ['webapp.services', 'webapp.filters', 'ui.bootstrap']);
 });