define(['../module', 'lodash'],function(services, _){
	'use strict';
	services.factory("recycleService",['$http','$q', '$rootScope','hisService',function($http, $q, $rootScope, hisService){
        var _service = {};
        var _refreshRecycleDetails = function(recycleDetails, draws){
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
            }).then(
                function(recv){
                    var data = recv.data;
                    $rootScope.$broadcast('recycles.create', data);
                    if(data.status !== 0){
                        return null;
                    }
                    var recycle = data.value;
                    return recycle;
                }
            ).then(
                function(recycle){
                    if (!recycle) return null;
                    return _getRecycleDetails(recycle.id);
                }
            ).then(
                function(recv){
                    if (!recv) return;
                    var recycleDetails = recv.data.value;
                    _refreshRecycleDetails(recycleDetails, draws);
                }
            ).then(
                null,
                function(err){
                    $rootScope.$broadcast('recycles.create', false);
                }
            );
        };
        var _getRecycleById = function(id){
            return $http.get('/opsupport/recycle/'+id);
        };
        var _getRecycleDetails = function(id){
            return $http.get('/opsupport/recycle/detail/'+id);
        };
        var _getRecyclesByRecycleIds = function(arrRecycleId){
            return $http.post('/opsupport/recycle/', arrRecycleId);
        };
        var _queryParam={
            dateBegin  : moment().format('YYYY-MM-DD'),
            dateEnd    : moment().format('YYYY-MM-DD'),
            barcode    : '',
            returner   : '',
            recycler   : '',
            pageNo     : 1,
            pageSize   : 1,
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
            return $http.get('/opsupport/recycle/q',{params: params});
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
                    defered.resolve(_recycles);
                    return _recycles;
                },
                function(err){
                    defered.reject(err);
                }
            )
            return defered.promise;
        };
        _service.createNewRecycle = _createNewRecycle;
        _service.getRecycleById = _getRecycleById;
        _service.getRecycleDetails = _getRecycleDetails;
        _service.getRecyclesByRecycleIds = _getRecyclesByRecycleIds;
        return _service;
	}]);
});

