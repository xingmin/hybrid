define(['../module', "lodash", "moment"],function(controllers, _, moment){
    'use strict';
    controllers.controller('syncUserCtrl',
        ['$scope','$http','$timeout', '$filter', 'syncUserService', 'messageService',
        function($scope, $http, $timeout,$filter, syncUserService, messageService){
            $scope.users = null;
            $scope.refresh = function(){
                syncUserService.getUsers().then(
                    function(data){
                        $scope.users = data;
                        _.forEach($scope.users, syncUserService.checkUserSyncStatus);
                        messageService.sendMessage("刷新成功；");
                        return $scope.users;
                    }
                )
            };

        }]
    );
});
