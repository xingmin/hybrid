define(['../module', "lodash", "moment"],function(controllers, _, moment){
    'use strict';
    controllers.controller('syncUserCtrl',
        ['$scope','$http','$timeout', '$filter', 'syncUserService', 'messageService',
        function($scope, $http, $timeout,$filter, syncUserService, messageService){
            $scope.users = null;
            $scope.deptSelected = {};
            $scope.refresh = function(){
                var dept = $scope.deptSelected.code || '';
                syncUserService.getUsers(dept).then(
                    function(data){
                        $scope.users = data;
                        messageService.sendMessage("刷新成功");
                        _.forEach($scope.users, syncUserService.checkUserSyncStatus);
                        return $scope.users;
                    }
                )
            };
            $scope.sync = function(){
                _.forEach($scope.users, function(user){
                    if(!user.selected || user.syncStatus) return;
                    syncUserService.syncUser(user);
                });
            };
            $scope.selectAllUser = function(){
                _.forEach($scope.users,function(user){
                    user.selected = !user.selected;
                });
            };
        }]
    );
});
