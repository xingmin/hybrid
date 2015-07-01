define(['angular', 'angular-ui-select', 'services/mainservice', 'directives/message' ], function(angular) {
    'use strict';
    return angular.module('webapp.directives', ['ui.bootstrap', 'ui.select', 'my.message', 'webapp.services', 'webapp.filters']);
});