define(['../module', 'lodash', 'moment'],function(services, _, moment){
	'use strict';
	services.factory("syncUserService",['$http','$q', '$rootScope','hisService','userService',function($http, $q, $rootScope, hisService, userService){
        var _service = {};
        var _users = null;
        var _getUsers = function(){
            var defered =$q.defer();
            hisService.getHisUserOfOpSupport().then(
                function(users){
                    _users = users;
                    defered.resolve(_users);
                },
                function(users){
                    _users = users;
                    defered.reject(_users);
                }
            );
            return defered.promise;
        };
        var _checkUserSyncStatus = function(user){
            userService.checkUserEmpCodeExistence(user.code).then(
                function(stat){
                    user.synced = stat;
                }
            );
        };
        _service.checkUserSyncStatus = _checkUserSyncStatus;
        _service.getUsers = _getUsers;
        return _service;
	}]);
});

