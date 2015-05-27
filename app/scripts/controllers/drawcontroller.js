define(['./module', "lodash", "moment"],function(controllers, _, moment){
    'use strict';
    controllers.controller('drawController',
        ['$scope','$http','$timeout', '$filter',
            'drawService','recycleService','indexedDbService','userService','AuthValue',
        function($scope, $http, $timeout,$filter,
                 drawService, recycleService, indexedDbService, userService, AuthValue){
            $scope.draws = [];//drawService.queryDraws();
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
                        $scope.queryParam.pageSize = data;
                    }
                }
            ).finally(
                function(){
                    $scope.query();
                }
            );
            $scope.saveChange = function() {
                $scope.isSaveCompleted = false;
                if ($scope.mode == 'edit') {
                    drawService.saveChangeDraw($scope.currentedit.newval.id,
                        $scope.currentedit.newval.consumer,
                        $scope.DRAW.receiver.selectedItem.empCode,//$scope.currentedit.newval.receiver,
                        $scope.currentedit.newval.remark,
                        $scope.DRAW.drawer.selectedItem.empCode || $scope.currentedit.oldval.empCode,//$scope.currentedit.newval.drawer,
                        $scope.currentedit.newval.drawDetails
                    );
                }
                if ($scope.mode == 'create') {
                    drawService.createNewDraw(
                        $scope.currentedit.newval.consumer,
                        $scope.DRAW.receiver.selectedItem.empCode,
                        $scope.currentedit.newval.remark,
                        $scope.DRAW.drawer.selectedItem.empCode || AuthValue.currentUser.empCode,//$scope.currentedit.newval.drawer,
                        $scope.currentedit.newval.drawDetails
                    );
                }
            };
            $scope.$on('draws.create', function(event, data){
                var msg = '创建成功';
                if (data.status ===0 ){
                    $scope.isSaveCompleted = true;
                }else{
                    msg = data.errmsg;
                }
                $scope.DRAW.msgs.push(data.errmsg);
            });
            $scope.$on('draws.update', function(event, data){
                var msg = "保存成功";
                if (data.status ===0 ){
                    $scope.isSaveCompleted = true;
                }else{
                    msg = "保存失败"+data.errmsg;
                }
                $scope.DRAW.msgs.push(msg);
            });
            //create --新建
            //edit --编辑
            $scope.changeEditMode = function(mode){
                $scope.mode = mode;
                if(mode == 'create'){
                    $scope.currentedit={newval:{},oldval:{}};
                    //默认分发人为当前登录的用户
                    $scope.currentedit.newval.drawer = AuthValue.currentUser.empCode;
                }
            };
            $scope.deleteCurrent = function() {
                var cur = $scope.currentedit.oldval;
                $scope.IsHideModal = false;
                drawService.deleteDraw(cur.id);
            };
            $scope.$on('draws.delete', function(event, status){
                var msg = '删除失败';
                if (status){
                    $scope.IsHideModal = true;
                    msg='删除成功';
                }
                $scope.msgs.push(msg);
            });
            $scope.addDrawDetail = function(event, barcode){
                if(event.which === 13){
                    if( !angular.isArray($scope.currentedit.newval.drawDetails)){
                        $scope.currentedit.newval.drawDetails=[];
                    }
                    //var barCodeRegex =/^[A-z0-9]+$/;
                    //if (!barCodeRegex.test(barcode)){
                    //    $scope.DRAW.msgs.push("不是有效的条形码!");
                    //    event.preventDefault();
                    //    return;
                    //};
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
            $scope.DRAW.msgs = [];
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
                    return userService.getUsersPromise({py: $scope.DRAW.receiver.py});
                }
            };
            $scope.DRAW.drawer = {
                "py":"",
                "selectedItem" : {},
                "showColumns":["empCode","legalName"],
                "queryByPinyin":function(){
                    return userService.getUsersPromise({py: $scope.DRAW.drawer.py});
                }
            };
            $scope.$watch('currentedit.newval', function(){
                $timeout(function(){
                    $scope.DRAW.receiver.py =
                        $scope.currentedit.newval.receiver
                            ? $filter('userFilter')($scope.currentedit.newval.receiver): '';
                    $scope.DRAW.drawer.py =
                        $scope.currentedit.newval.drawer
                            ? $filter('userFilter')($scope.currentedit.newval.drawer): '';
                },600);
            });

            //下面是回收的操作
            $scope.recycle = {};
            $scope.recycle.isRecycleSaved = false;
            $scope.recycle.msgs = [];
            $scope.recycle.barcodeCollecter = '';
            $scope.recycle.initRecycleModal = function(){
                $scope.recycle.recycler.py = AuthValue.currentUser.legalName;
                $scope.recycle.barcodeCollecter='';
                $scope.recycle.recycleDetails=[];
            };
            $scope.recycle.recycler = {
                "py":"",
                "selectedItem" : {},
                "showColumns":["empCode","legalName"],
                "queryByPinyin":function(){
                    return userService.getUsersPromise({py: $scope.recycle.recycler.py});
                }
            };
            $scope.recycle.returner = {
                "py":"",
                "selectedItem" : {},
                "showColumns":["empCode","legalName"],
                "queryByPinyin":function(){
                    return userService.getUsersPromise({py: $scope.recycle.returner.py});
                }
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
                    $scope.recycle.returner.selectedItem.empCode || '',//$scope.recycle.returner,
                    $scope.recycle.recycler.selectedItem.empCode || AuthValue.currentUser.empCode,//$scope.recycle.recycler,
                    $scope.recycle.remark,
                    $scope.recycle.recycleDetails,
                    drawService.getDraws()
                );
            };
            $scope.$on('recycles.create', function(event, data){
                var msg = "创建回收记录成功!";
                if (data.status === 0){
                    $scope.recycle.isRecycleSaved = true;
                }else{
                    msg = data.errmsg;
                }
                $scope.recycle.msgs.push(msg);
            });

        }]
    );
});
