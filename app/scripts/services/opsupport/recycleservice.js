define(['../module', 'lodash'],function(services, _){
	'use strict';
	services.factory("recycleService",['$http', '$rootScope','hisService',function($http, $rootScope, hisService){
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

        _service.createNewRecycle = _createNewRecycle;
        _service.getRecycleById = _getRecycleById;
        _service.getRecycleDetails = _getRecycleDetails;
        _service.getRecyclesByRecycleIds = _getRecyclesByRecycleIds;
        return _service;
	}]);
});

