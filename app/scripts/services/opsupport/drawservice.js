define(['../module', 'moment', 'lodash'],function(services, moment, _){
	'use strict';
	services.factory("drawService", ['$http', '$rootScope' ,'baseOpSupportService', 'hisService',function($http, $rootScope,baseOpSupportService, hisService){
        var service  = {};
        var _draws = null;
        var _queryParam={
            dateBegin  : moment().format('YYYY-MM-DD')+" 00:00:01",
            dateEnd    : moment().format('YYYY-MM-DD')+" 23:59:59",
            barcode    : '',
            consumer   : '',
            receiver   : '',
            pageNo     : 1,
            pageSize   : 5,
            pageCount  : 0,
            totalItems : 0
        };
        var _getDrawDetailsByDrawId  = function(drawId){
            return $http.get('/opsupport/draw/getdetail/'+drawId);
        };
        var _getDrawsByDate = function(dBegin, dEnd, barcode, consumer, receiver, pageSize, pageNo){
            var params = {
                b: dBegin,
                e: dEnd,
                barcode: barcode,
                consumer: consumer,
                receiver: receiver,
                pagesize: pageSize,
                pageno: pageNo
            };
            return $http.get('/opsupport/draw/q',{params: params});
        };
        var _refreshDrawDetails = function(arrDrawDetail){
            angular.forEach(arrDrawDetail, function(detail){
                hisService.getBarCodeChargeInfo(detail.barcode).then(
                    function(chargeInfo){
                        if(!chargeInfo) return;
                        if(detail) {
                            detail.chargeInfo = chargeInfo;
                            detail.chargeHtml = hisService.convertBarCodeInfoToHtml(chargeInfo);
                        }
                    }
                );
                if(!detail || !detail.recycleId) return;
                baseOpSupportService.getRecycleById(detail.recycleId).then(
                    function(recv){
                        detail.recycle = recv.data.value;
                    }
                );
            });
        };
        var _queryDraws = function() {
            _getDrawsByDate(_queryParam.dateBegin,
                _queryParam.dateEnd,
                _queryParam.barcode,
                _queryParam.consumer,
                _queryParam.receiver,
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
                            _refreshDrawDetails(draw.drawDetails);
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
        var _saveChangeDraw = function(id, consumer, receiver, remark, drawer, expectedReceiveTime, drawDetails){
            $http.post('/opsupport/draw/update/',
                {
                    'id':id,
                    'consumer':consumer,
                    'receiver':receiver,
                    'remark' : remark,
                    'drawer':drawer,
                    'expectedReceiveTime': moment(expectedReceiveTime).format() ,
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
                            draw.expectedReceiveTime = expectedReceiveTime;
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
                            _refreshDrawDetails(newDraw.drawDetails);
                        });
                    },
                    function(err){
                        //$rootScope.$broadcast('draws.update', err.message);
                        $rootScope.$broadcast('draws.update', false);
                    }
            );
        };
        var _createNewDraw = function(consumer, receiver, remark, drawer, expectedReceiveTime, drawDetails){
            $http.post('/opsupport/draw/create/',
                {
                    'consumer':consumer,
                    'receiver':receiver,
                    'remark' : remark,
                    'drawer':drawer,
                    'expectedReceiveTime': moment(expectedReceiveTime).format() ,
                    'drawDetails' : drawDetails
                }
            ).then(function(receive){
                    var data = receive.data;
                    $rootScope.$broadcast('draws.create', data);
                    if(data.status === 0){
                        if(!_draws) _draws=[];
                        _draws.splice(0, 0, data.value);
                        return data.value;
                    }else{
                        return null;
                    }
                })
                .then(
                function(newDraw){
                    if(!newDraw){ return; }
                    _getDrawDetailsByDrawId(newDraw.id).success(function(data){
                        newDraw.drawDetails = data.value;
                        _refreshDrawDetails(newDraw.drawDetails);
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
        var _getDrawById = function(id){
            return baseOpSupportService.getDrawById(id);
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
        service.getDrawById = _getDrawById;
        return service;
	}])
});

