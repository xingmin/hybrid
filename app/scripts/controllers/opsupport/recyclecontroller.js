define(['../module', "lodash", "moment"],function(controllers, _, moment){
    'use strict';
    controllers.controller('recycleController',
        ['$scope','$http','$timeout', '$filter',
            'drawService','recycleService','indexedDbService','userService','AuthValue','oproomService','hisService',
        function($scope, $http, $timeout,$filter,
                 drawService, recycleService, indexedDbService, userService, AuthValue, oproomService, hisService){
            $scope.RECYCLE = {};
            $scope.RECYCLE.recycles = [];//drawService.queryDraws();
            $scope.RECYCLE.msgs=[];
            $scope.RECYCLE.currentedit={newval:{},oldval:{}};
            $scope.RECYCLE.queryParam = recycleService.queryParam;
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
                //$scope.RECYCLE.queryParam.returner = $scope.RECYCLE.receiver.selected? ($scope.RECYCLE.receiver.selected.empCode || ''): '';
                if($scope.RECYCLE.queryParamCheck()){
                    recycleService.queryRecycles().then(
                        function(recycles){
                            $scope.RECYCLE.recycles = recycles;
                        }
                    );
                }
            };
            //把pagesize保存在indexeddb
            $scope.$watch('RECYCLE.queryParam.pageSize', function(newVal, oldVal){
                if(newVal === oldVal){
                    return;
                }
                indexedDbService.setAppConfig('recyclePageSize',newVal).then(
                    function(){
                        console.log('save pageSize succeeded！');
                    },
                    function(){console.log('save pageSize failed!')}
                );
            });
            indexedDbService.getAppConfig('recyclePageSize').then(
                function(data){
                    if(data && data.length>0){
                        $scope.RECYCLE.queryParam.pageSize = data;
                    }
                }
            ).finally(
                function(){
                    $scope.query();
                }
            );
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
        }]
    );
});
