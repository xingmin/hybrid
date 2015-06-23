define(['../module', "lodash", "moment"],function(controllers, _, moment){
    'use strict';
    controllers.controller('barCodeAuditCtrl',
        ['$scope','$http','$timeout', 'hisService', 'messageService', 'barCodeService', 'indexedDbService',
        function($scope, $http, $timeout, hisService, messageService, barCodeService, indexedDbService){
            $scope.SEARCH = {};
            $scope.SEARCH.queryParam ={
                qstart  : moment().format('YYYY-MM-DD')+" 00:00:01",
                qend    : moment().format('YYYY-MM-DD')+" 23:59:59",
                barCode    : '',
                inpatientNo   : '',
                times   : '',
                totalItems: 0,
                pageSize: 10,
                pageNo: 1
            };
            $scope.SEARCH.dateBeginPickerOpen = false;
            $scope.SEARCH.toggleDateBeginPicker = function($event) {
                $event.stopPropagation();
                $scope.SEARCH.dateBeginPickerOpen = !$scope.SEARCH.dateBeginPickerOpen;
            };
            $scope.SEARCH.dateEndPickerOpen = false;
            $scope.SEARCH.toggleDateEndPicker = function($event) {
                $event.stopPropagation();
                $scope.SEARCH.dateEndPickerOpen = !$scope.SEARCH.dateEndPickerOpen;
            };
            $scope.SEARCH.chargeInfos = null;
            $scope.SEARCH.query = function(){
                hisService.getBarCodeChargeInfoList($scope.SEARCH.queryParam.qstart,
                    $scope.SEARCH.queryParam.qend,
                    $scope.SEARCH.queryParam.barCode,
                    $scope.SEARCH.queryParam.inpatientNo,
                    $scope.SEARCH.queryParam.times,
                    $scope.SEARCH.queryParam.pageNo,
                    $scope.SEARCH.queryParam.pageSize
                ).then(
                    function(data){
                        $scope.SEARCH.chargeInfos = data;
                        _.forEach($scope.SEARCH.chargeInfos, function(chargeInfo){
                            barCodeService.getBarCodeStatus(chargeInfo.barCode).then(
                                function(stat){
                                    chargeInfo.status = stat;
                                    chargeInfo.statusText = barCodeService.convertStatusToHumanReadable(stat);
                                }
                            );
                        });
                    }
                );

                hisService.getBarCodeChargeInfoListCount($scope.SEARCH.queryParam.qstart,
                    $scope.SEARCH.queryParam.qend,
                    $scope.SEARCH.queryParam.barCode,
                    $scope.SEARCH.queryParam.inpatientNo,
                    $scope.SEARCH.queryParam.times
                ).then(
                    function(data){
                        $scope.SEARCH.queryParam.totalItems = data;
                    }
                );
            };

        }]
    );
});
