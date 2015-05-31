define(['../module', 'moment'],function(services, moment){
	'use strict';
	services.factory("drawService", ['$http', '$rootScope' ,'recycleService',function($http, $rootScope,recycleService){
        var service  = {};
        var _draws = null;
        var _queryParam={
            dateBegin  : moment().format('YYYY-MM-DD'),
            dateEnd    : moment().format('YYYY-MM-DD'),
            barcode    : '',
            consumer   : '',
            pageNo     : 1,
            pageSize   : 1,
            pageCount  : 0,
            totalItems : 0
        };
        var _getDrawDetailsByDrawId  = function(drawId){
            return $http.get('/opsupport/draw/getdetail/'+drawId);
        };
        var _getDrawsByDate = function(dBegin, dEnd, barcode, consumer, pageSize, pageNo){
            var params = {
                b: dBegin,
                e: dEnd,
                barcode: barcode,
                consumer: consumer,
                pagesize: pageSize,
                pageno: pageNo
            };
            return $http.get('/opsupport/draw/q',{params: params});
        };
        var _queryDraws = function() {
            _getDrawsByDate(_queryParam.dateBegin,
                _queryParam.dateEnd,
                _queryParam.barcode,
                _queryParam.consumer,
                _queryParam.pageSize,
                _queryParam.pageNo).then(function (receive) {
                    var data = receive.data;
                    if (data.status !== 0) {
                        throw new Error(data.errmsg);
                    }
                    _draws = data.value.pageData;
                    _queryParam.pageCount = data.value.pageInfo.pageCount;
                    _queryParam.totalItems = data.value.pageInfo.totalRows;
                    $rootScope.$broadcast('draws.refresh', true);
                    return _draws;
            }).then(
                function (draws) {
                    if(!draws || draws.length<=0) return;
                    draws.forEach(function (draw) {
                        _getDrawDetailsByDrawId(draw.id).success(function (data) {
                            if (data.status !== 0) {
                                return;
                            }
                            draw.drawDetails = data.value;
                            angular.forEach(draw.drawDetails, function (drawDetail) {
                                if(!drawDetail || !drawDetail.recycleId) return;
                                recycleService.getRecycleById(drawDetail.recycleId).success(
                                    function (data) {
                                        drawDetail.recycle = data.value;
                                    }
                                );
                            });
                        });
                    });
                },
                function (err) {
                    //$scope.msgs.push(err.message);
                    $rootScope.$broadcast('draws.refresh', {code: 1, message: err.message});
                }
            );
            return _draws;
        };
        var _saveChangeDraw = function(id, consumer, receiver, remark, drawer, drawDetails){
            $http.post('/opsupport/draw/update/',
                {
                    'id':id,
                    'consumer':consumer,
                    'receiver':receiver,
                    'remark' : remark,
                    'drawer':drawer,
                    'drawDetails' : drawDetails
                }
            ).then(
                function(resp){
                    var data = resp.data;
                    $rootScope.$broadcast('draws.update', data);
                    if(data.status !== 0){
                        return null;
                    }
                    var targetDraw = null;
                    _draws.every(function (draw) {
                        if (draw.id === id) {
                            draw.consumer = consumer;
                            draw.receiver = receiver;
                            draw.remark = remark;
                            draw.drawer = drawer;
                            draw.drawDetails = drawDetails;
                            targetDraw = draw;
                            return false;
                        }
                        return true;
                    });
                    return targetDraw;
                }).then(
                    function(newDraw){
                        if(!newDraw){
                            return;
                        }
                        _getDrawDetailsByDrawId(newDraw.id).success(function(data){
                            newDraw.drawDetails = data.value;
                            angular.forEach(newDraw.drawDetails, function(detail){
                                recycleService.getRecycleById(detail.recycleId).then(
                                    function(recv){
                                        detail.recycle = recv.data.value;
                                    }
                                );
                            });
                        });
                    },
                    function(err){
                        //$rootScope.$broadcast('draws.update', err.message);
                        $rootScope.$broadcast('draws.update', false);
                    }
            );
        };
        var _createNewDraw = function(consumer, receiver, remark, drawer, drawDetails){
            $http.post('/opsupport/draw/create/',
                {
                    'consumer':consumer,
                    'receiver':receiver,
                    'remark' : remark,
                    'drawer':drawer,
                    'drawDetails' : drawDetails
                }
            ).then(function(receive){
                    var data = receive.data;
                    $rootScope.$broadcast('draws.create', data);
                    if(data.status === 0){
                        _draws.splice(0, 0, data.value);
                        return data.value;
                    }else{
                        return null;
                    }
                })//�����ݿ���ر���ɹ����Details��¼
                .then(
                function(newDraw){
                    if(!newDraw){ return; }
                    _getDrawDetailsByDrawId(newDraw.id).success(function(data){
                        newDraw.drawDetails = data.value;
                        angular.forEach(newDraw.drawDetails, function(detail){
                            recycleService.getRecycleById(detail.recycleId).success(
                                function(data){
                                    detail.recycle = data.value;
                                }
                            );
                        });
                    });
                },
                function(err){
                    $rootScope.$broadcast('draws.create', false);
                }
            );
        };
        var _deleteDraw = function(id){
            $http.post('/opsupport/draw/delete', {'id':id}).then(
                function(recv){
                    var data = recv.data;
                    if(data.status !== 0){
                        throw new Error(data.errmsg);
                    }
                    _draws.every(function(val,index){
                        if(val.id == id){
                            _draws.splice(index,1);
                            return false;
                        }
                        return true;
                    });
                    $rootScope.$broadcast('draws.delete', true);
                }
            ).then(
                null,
                function(err){
                    $rootScope.$broadcast('draws.delete', false);
                }
            );
        };
        service.queryDraws = _queryDraws;
        service.deleteDraw = _deleteDraw;
        service.createNewDraw = _createNewDraw;
        service.saveChangeDraw = _saveChangeDraw;
        service.getDrawDetailsByDrawId = _getDrawDetailsByDrawId;
        service.getDraws = function(){
            return _draws;
        };
        service.getQueryParam = function(){
           return _queryParam;
        };
        return service;
	}])
});

