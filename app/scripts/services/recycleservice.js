define(['./module'],function(services){
	'use strict';
	services.factory("recycleService",['$http', '$rootScope',function($http, $rootScope){
        var _service = {};
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
                    return recycle;//recycle对象
                }
            ).then(
                function(recycle){
                    if (!recycle) return null;
                    return _getRecycleDetails(recycle.id);
                }
            ).then(
                function(recv){
                    if (!recv) return;
                    //更新当前界面的数据
                    var recycleDetails = recv.data.value;
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
                                    return false;
                                }
                                return true;
                            });
                            return founded;
                        });
                    });
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

