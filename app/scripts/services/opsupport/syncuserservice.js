define(['../module', 'lodash', 'moment'],function(services, _, moment){
	'use strict';
	services.factory("syncUserService",['$http','$q', '$rootScope','hisService','userService',function($http, $q, $rootScope, hisService, userService){
        var _service = {};
        var _users = null;
        var _getUsers = function(dept, py){
            var defered =$q.defer();
            var params = {
                unit: dept,
                py: py
            };
            hisService.getHisUserOfOpSupport(params).then(
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
                    user.syncStatus = stat;
                }
            );
        };
        var _syncUser = function(user){
            userService.checkUserEmpCodeExistence(user.code).then(
                function(existence){
                    user.syncStatus = existence;
                    if(existence) return;
                    userService.createNewUserQ(user.name, user.code, '', '', user.code, user.py).success(function(data){
                        if(data.code === 0){
                            user.syncStatus = true;
                        }
                    });
                }
            );
        };
        _service.checkUserSyncStatus = _checkUserSyncStatus;
        _service.getUsers = _getUsers;
        _service.syncUser = _syncUser;
        return _service;
	}]);
});

