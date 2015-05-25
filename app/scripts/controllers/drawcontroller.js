define(['./module'],function(controllers){
    'use strict';
    controllers.controller('drawController',
        ['$scope','$http','$timeout','drawService','recycleService', '_','moment','indexedDbService','userService',
        function($scope, $http, $timeout, drawService, recycleService, _, moment, indexedDbService, userService){
            //$scope.moment = moment;
            //$scope._ = _;
            $scope.draws = drawService.queryDraws();
            $scope.$on('draws.refresh', function(event, status){
                if (status){
                    $scope.draws = drawService.getDraws();
                };
            });
            $scope.scanner = {barcodeCollecter : ''};
            $scope.IsHideModal = true;
            $scope.msgs=[];
            $scope.mode = '';
            $scope.currentedit={newval:{},oldval:{}};
            $scope.isSaveCompleted = false;
            $scope.queryParam = drawService.getQueryParam();
            $scope.query = function(){ drawService.queryDraws(); };
            //把pagesize保存在indexeddb
            $scope.$watch('queryParam.pageSize', function(newVal, oldVal){
                if(newVal === oldVal){
                    return;
                }
                indexedDbService.setAppConfig('drawPageSize',newVal).then(
                    function(){
                        console.log('save pageSize succeeded！');
                    },
                    function(){console.log('save pageSize failed!')}
                );
            });
            indexedDbService.getAppConfig('drawPageSize').then(
                function(data){
                    if(data && data.length>0){
                        $scope.queryParam.pageSize = data[0];
                        $scope.query();
                    }
                }
            ).finally(
                function(){ $scope.query(); }
            );
            $scope.saveChange = function() {
                $scope.isSaveCompleted = false;
                if ($scope.mode == 'edit') {
                    drawService.saveChangeDraw($scope.currentedit.newval.id,
                        $scope.currentedit.newval.consumer,
                        $scope.currentedit.newval.receiver,//$scope.DRAW.receiver.selectedItem.empCode,//
                        $scope.currentedit.newval.remark,
                        $scope.currentedit.newval.drawer,
                        $scope.currentedit.newval.drawDetails
                    );
                }
                if ($scope.mode == 'create') {
                    drawService.createNewDraw(
                        $scope.currentedit.newval.consumer,
                        $scope.currentedit.newval.receiver,
                        $scope.currentedit.newval.remark,
                        $scope.currentedit.newval.drawer,
                        $scope.currentedit.newval.drawDetails
                    );
                }
            };
            $scope.$on('draws.create', function(event, status){
                if (status){
                    $scope.isSaveCompleted = true;
                };
            });
            $scope.$on('draws.update', function(event, status){
                if (status){
                    $scope.isSaveCompleted = true;
                };
            });
            //create --新建
            //edit --编辑
            //del --删除
            $scope.changeEditMode = function(mode){
                $scope.mode = mode;
                if(mode == 'create'){
                    $scope.currentedit={newval:{},oldval:{}};
                }
            };
            $scope.deleteCurrent = function() {
                var cur = $scope.currentedit.oldval;
                $scope.IsHideModal = false;
                drawService.deleteDraw(cur.id);
            };
            $scope.$on('draws.delete', function(event, status){
                if (status){
                    $scope.IsHideModal = true;
                };
            });
            $scope.addDrawDetail = function(event, barcode){
                if(event.which === 13){
                    if( !angular.isArray($scope.currentedit.newval.drawDetails)){
                        $scope.currentedit.newval.drawDetails=[];
                    }
                    $scope.currentedit.newval.drawDetails.push({'barcode':barcode});
                    $scope.scanner.barcodeCollecter = '';
                    event.preventDefault();
                }
            };
            $scope.deleteDrawDetail = function(arrDrawDetail, drawDetail){
                arrDrawDetail
                && arrDrawDetail.length>0
                && arrDrawDetail.splice(arrDrawDetail.indexOf(drawDetail),1);
            };
            $scope.DRAW = {};
            $scope.DRAW.isDrawDeletable = function(draw){
                if(draw && draw.drawDetails && _.isArray(draw.drawDetails)){
                    var deletable=draw.drawDetails.every(function(drawDetail){
                        return _.isNull(drawDetail.recycleId);
                    });
                    //console.log('可删除');
                    return deletable;
                }
                return false;
            };
            $scope.DRAW.receiver = {
                "py":"",
                "selectedItem" : {},
                "showColumns":["empCode","legalName"],
                "queryByPinyin":function(){
                    return userService.getUsers($scope.DRAW.receiver.py);
                }
            };
            $scope.$watch('currentedit.newval', function(){
                $timeout(function(){
                    $scope.DRAW.receiver.py = $scope.currentedit.newval.receiver || '';
                },600);
            });
            //下面是回收的操作
            $scope.recycle = {};
            $scope.recycle.isRecycleSaved = false;
            $scope.recycle.msgs = [];
            $scope.recycle.barcodeCollecter = '';
            $scope.recycle.initRecycleModal = function(){
                $scope.recycle.barcodeCollecter='';
                $scope.recycle.recycleDetails=[];
            };
            $scope.recycle.initRecycleModal();
            $scope.recycle.collectBarcode = function(event, barcode){
                if(event.which === 13){
                    if( !angular.isArray($scope.recycle.recycleDetails)){
                        $scope.recycle.recycleDetails=[];
                    }
                    $scope.recycle.recycleDetails.push({'barcode':barcode, 'useFlag':0});
                    $scope.recycle.barcodeCollecter = '';
                    event.preventDefault();
                }
            };
            $scope.recycle.deleteBarcode = function(arrRecycleDetail, detail){
                arrRecycleDetail
                    && arrRecycleDetail.length>0
                    && arrRecycleDetail.splice(arrRecycleDetail.indexOf(detail),1);
            };
            $scope.recycle.saveRecycle = function(){
                $scope.recycle.isRecycleSaved = false;
                recycleService.createNewRecycle(
                    $scope.recycle.returner,
                    $scope.recycle.recycler,
                    $scope.recycle.remark,
                    $scope.recycle.recycleDetails,
                    drawService.getDraws()
                );
            };
            $scope.$on('recycles.create', function(event, status){
                if (status){
                    $scope.recycle.isRecycleSaved = true;
                };
            });

        }]
    );
});
