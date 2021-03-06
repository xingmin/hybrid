define(['../module', 'lodash', 'moment'],function(services, _, moment){
	'use strict';
	services.factory("recycleService",['$http','$q', '$rootScope','hisService', 'baseOpSupportService',function($http, $q, $rootScope, hisService, baseOpSupportService){
        var _service = {};
        var _refreshDrawDetails = function(recycleDetails, draws){
            if(!_.isArray(draws) && draws.length<=0) return;
            angular.forEach(recycleDetails, function(recycleDetail){
                draws.every(function(draw){
                    var founded = draw.drawDetails.every(function(drawDetail){
                        if(recycleDetail.id === drawDetail.id){
                            drawDetail.useFlag = recycleDetail.useFlag;
                            drawDetail.recycleId = recycleDetail.recycleId;
                            _getRecycleById(drawDetail.recycleId).then(
                                function(recv){
                                    drawDetail.recycle = recv.data.value;
                                }
                            );
                            hisService.getBarCodeChargeInfo(drawDetail.barcode).then(
                                function(chargeInfo){
                                    if(!chargeInfo) return;
                                    if(drawDetail) {
                                        drawDetail.chargeInfo = chargeInfo;
                                        drawDetail.chargeHtml = hisService.convertBarCodeInfoToHtml(chargeInfo);
                                    }
                                }
                            );
                            return false;
                        }
                        return true;
                    });
                    return founded;
                });
            });
        };
		var _createNewRecycle = function(returner, recycler, remark, recycleDetails, draws){
            $http.post('/opsupport/recycle/create/',{
                'returner':returner,
                'recycler': recycler,
                'remark': remark,
                'recycleDetails': recycleDetails
            }).success(
                function(data){
                    $rootScope.$broadcast('recycles.create', data);
                    if(data.code !== 0){
                        return null;
                    }
                    var recycle = data.value;

                    if(draws != undefined){
                        _refreshDrawDetails(recycleDetails, draws);
                        return;
                    }
                    if(!_.isArray(_recycles)){
                        _recycles = [];
                    }
                    _recycles.push(recycle);
                    _refreshSingleRecycleDetails(recycle);
                }
            ).error(
                function(err){
                    $rootScope.$broadcast('recycles.create', {code:2, message: err.message});
                }
            );
        };
        var _getRecycleById = function(id){
            return baseOpSupportService.getRecycleById(id);
        };
        var _getRecycleDetails = function(id){
            return $http.get('/opsupport/recycle/detail/'+id);
        };
        var _getRecyclesByRecycleIds = function(arrRecycleId){
            return $http.post('/opsupport/recycle/', arrRecycleId);
        };
        var _queryParam={
            dateBegin  : moment().format('YYYY-MM-DD')+" 00:00:01",
            dateEnd    : moment().format('YYYY-MM-DD')+" 23:59:59",
            barcode    : '',
            returner   : '',
            recycler   : '',
            pageNo     : 1,
            pageSize   : 5,
            pageCount  : 0,
            totalItems : 0
        };
        var _queryRecyclesQ = function(dBegin, dEnd, barcode, returner, recycler, pageSize, pageNo){
            var params = {
                b: dBegin,
                e: dEnd,
                barcode: barcode,
                returner: returner,
                recycler: recycler,
                pagesize: pageSize,
                pageno: pageNo
            };
            return $http.get('/opsupport/recycle/',{params: params});
        };
        var _recycles = null;
        var _queryRecycles = function() {
            var defered = $q.defer();
            _queryRecyclesQ(_queryParam.dateBegin, _queryParam.dateEnd,
                _queryParam.barcode, _queryParam.returner, _queryParam.recycler,
                _queryParam.pageSize, _queryParam.pageNo)
            .then(
                function (resp) {
                    var data = resp.data;
                    if (data.code !== 0) {
                        _recycles = [];
                    }else{
                        _recycles = data.value.pageData;
                    }
                    _queryParam.pageCount = data.value.pageInfo.pageCount;
                    _queryParam.totalItems = data.value.pageInfo.totalRows;
                    _refreshRecycleDetails(_recycles);
                    defered.resolve(_recycles);
                    return _recycles;
                },
                function(err){
                    defered.reject(err);
                }
            )
            return defered.promise;
        };
        var _refreshSingleRecycleDetails = function(recycle){
            _getRecycleDetails(recycle.id).success(function (data) {
                if (data.status !== 0) {
                    return;
                }
                recycle.recycleDetails = data.value;
                _refreshRecycleDetailsRelatedDraw(recycle.recycleDetails);
            });
        };
        var _refreshRecycleDetails = function(recycles){
            angular.forEach(recycles, _refreshSingleRecycleDetails);
        };
        var _refreshSingleRecycleDetailRelatedDraw = function(detail){
            hisService.getBarCodeChargeInfo(detail.barcode).then(
                function(chargeInfo){
                    if(!chargeInfo) return;
                    if(detail) {
                        detail.chargeInfo = chargeInfo;
                        detail.chargeHtml = hisService.convertBarCodeInfoToHtml(chargeInfo);
                    }
                }
            );
            if(!detail || !detail.drawId) return;
            baseOpSupportService.getDrawById(detail.drawId).success(
                function(data){
                    detail.draw = data.value;
                }
            );
        };
        var _refreshRecycleDetailsRelatedDraw = function(recycleDetails){
            angular.forEach(recycleDetails, _refreshSingleRecycleDetailRelatedDraw);
        };
        var _deleteRecycle = function(id){
            var defered = $q.defer();
            $http.delete('/opsupport/recycle/'+id).success(
                function(data){
                    if(data.code !== 0) {
                        defered.reject(false);
                        return;
                    }
                    var index = _.findIndex(_recycles, {id: id});
                    _.isArray(_recycles) && _recycles.splice(index, 1);
                    defered.resolve(true);
                }
            ).error(
                function(){
                    defered.reject(false);
                }
            );
            return defered.promise;
        };
        var _deleteRecycleDetailInRecycles = function(recycles, id){
            _.every(recycles, function(recycle){
                var index = _.findIndex(recycle.recycleDetails, {id: id});
                index>=0 && _.isArray(recycle.recycleDetails) && recycle.recycleDetails.splice(index, 1);
                return (index<0);
            });
        };
        var _deleteRecycleDetailById = function(id){
            var defered = $q.defer();
            $http.delete('/opsupport/recycle/detail/'+id).success(
                function(data){
                    if(data.code !== 0) {
                        defered.reject(false);
                        return;
                    }
                    _deleteRecycleDetailInRecycles(_recycles, id);
                    defered.resolve(true);
                }
            ).error(
                function(){
                    defered.reject(false);
                }
            );
            return defered.promise;
        };
        _service.createNewRecycle = _createNewRecycle;
        _service.getRecycleById = _getRecycleById;
        _service.getRecycleDetails = _getRecycleDetails;
        _service.getRecyclesByRecycleIds = _getRecyclesByRecycleIds;
        _service.queryRecycles = _queryRecycles;
        _service.queryParam = _queryParam;
        _service.deleteRecycle = _deleteRecycle;
        _service.deleteRecycleDetailById = _deleteRecycleDetailById;
        return _service;
	}]);
});

