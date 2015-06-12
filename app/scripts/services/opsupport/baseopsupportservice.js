define(['../module', 'lodash', 'moment'],function(services, _, moment){
    'use strict';
    services.factory("baseOpSupportService",['$http','$q', '$rootScope','hisService',function($http, $q, $rootScope, hisService){
        var service = {};
        var _getRecycleById = function(id){
            return $http.get('/opsupport/recycle/'+id);
        };
        var _getDrawById = function(id){
            return $http.get('/opsupport/draw/'+id);
        };
        service.getRecycleById = _getRecycleById;
        service.getDrawById = _getDrawById;
        return service;
    }]);
});