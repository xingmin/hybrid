define(['../module', "lodash", "moment"],function(controllers, _, moment){
    'use strict';
    controllers.controller('recycleController',
        ['$scope','$http','$timeout', '$filter',
            'drawService','recycleService','indexedDbService','userService','AuthValue','oproomService','hisService','messageService',
        function($scope, $http, $timeout,$filter,
                 drawService, recycleService, indexedDbService, userService, AuthValue, oproomService, hisService,messageService){
            $scope.RECYCLE = {};
            $scope.RECYCLE.recycles = [];//drawService.queryDraws();
            $scope.RECYCLE.msgs=[];
            $scope.RECYCLE.currentedit={newval:{},oldval:{}};
            $scope.RECYCLE.queryParam = recycleService.queryParam;
            $scope.RECYCLE.returner = {};
            $scope.RECYCLE.recycler = {};
            $scope.allUsers = null;
            userService.getAllUsersQ().then(
                function(users){
                    $scope.allUsers = users;
                    if($scope.allUsers[0].legalName === '无'){
                        return;
                    }
                    $scope.allUsers.splice(0, 0, {legalName:'无', legalNamePY:''});
                }
            );
            $scope.initQuery = function(){
                $scope.RECYCLE.queryParam.returner = $scope.RECYCLE.returner.selected ? ($scope.RECYCLE.returner.selected.empCode || '') : '';
                $scope.RECYCLE.queryParam.recycler = $scope.RECYCLE.recycler.selected ? ($scope.RECYCLE.recycler.selected.empCode || '') : '';
            };
            $scope.RECYCLE.queryParamCheck = function() {
                var pass = true;
                var msg = "";
                if (!/^[A-z0-9]*$/.test($scope.RECYCLE.queryParam.barcode)) {
                    pass = false;
                    msg += "条形码格式验证不正确；";
                }
                if(!moment($scope.RECYCLE.queryParam.dateBegin).isValid()){
                    pass = false;
                    msg += "查询开始日期格式验证不正确；";
                }
                if(!moment($scope.RECYCLE.queryParam.dateEnd).isValid()){
                    pass = false;
                    msg += "查询截至日期格式验证不正确；";
                }
                if(msg) {
                    $scope.msgs.push(msg);
                }
                return pass;
            };
            $scope.RECYCLE.query = function(){
                $scope.initQuery();
                //$scope.RECYCLE.queryParam.returner = $scope.RECYCLE.receiver.selected? ($scope.RECYCLE.receiver.selected.empCode || ''): '';
                if($scope.RECYCLE.queryParamCheck()){
                    recycleService.queryRecycles().then(
                        function(recycles){
                            $scope.RECYCLE.recycles = recycles;
                        }
                    );
                }
            };
            $scope.RECYCLE.dateBeginPickerOpen = false;
            $scope.RECYCLE.toggleDateBeginPicker = function($event) {
                $event.stopPropagation();
                $scope.RECYCLE.dateBeginPickerOpen = !$scope.RECYCLE.dateBeginPickerOpen;
            };
            $scope.RECYCLE.dateEndPickerOpen = false;
            $scope.RECYCLE.toggleDateEndPicker = function($event) {
                $event.stopPropagation();
                $scope.RECYCLE.dateEndPickerOpen = !$scope.RECYCLE.dateEndPickerOpen;
            };
            $scope.$on('recycle-delete', function(event, stat){
                $scope.RECYCLE.msgs.push(stat.message);
            });
            $scope.updateMessage = function(){
                messageService.sendMessage("回收成功");
            };
        }]
    );
});
