define(['angular', 'lodash'],function(angular, _){
	'use strict';
    var performanceMonthService = angular.module("performance.month.service",[]);
    performanceMonthService.factory("performanceMonthService",['$http','$q' ,function($http, $q){
        var _service = {};
        var _monthList = null;
        var _getPerformanceMonths = function(minYear, minMonth, maxYear, maxMonth){
            var defered =$q.defer();
            var params = {
                minYear: minYear,
                minMonth: minMonth,
                maxYear: maxYear,
                maxMonth: maxMonth
            };
            $http.get('/performance/month/',{params: params}).success(
                function(data){
                    if(data.code === 0){
                        _monthList = data.value;
                    }else{
                        _monthList = [];
                    }
                    defered.resolve(_monthList);
                }
            ).error(
                function(err){
                    _monthList = [];
                    defered.reject(new Error('获取失败'));
                }
            );
            return defered.promise;
        };
        var _createNew = function(deptName, pinYin, oaEmpId){
            var defered =$q.defer();
            $http.post('/performance/month/',{
                'year':year,
                'month': month
            }).success(
                function(data){
                    if(data.code !== 0){
                        defered.reject(new Error(data.message));
                        return;
                    }
                    if(!_monthList){
                        _monthList = [];
                    }
                    _monthList.push(data.value);
                    defered.resolve(data.value);
                }
            ).error(
                function(err){
                    defered.reject(new Error(err.message));
                }
            );
            return defered.promise;
        };

        var _delete = function(id){
            var defered = $q.defer();
            $http.delete('/performance/month/'+id).success(
                function(data){
                    if(data.code !== 0) {
                        defered.reject(false);
                        return;
                    }
                    var index = _.findIndex(_monthList, {monthId: id});
                    _.isArray(_monthList) && _monthList.splice(index, 1);
                    defered.resolve(true);
                }
            ).error(
                function(){
                    defered.reject(false);
                }
            );
            return defered.promise;
        };

        _service.getPerformanceMonths = _getPerformanceMonths;
        _service.createNew = _createNew;
        _service.delete = _delete;
        return _service;
	}]);
});

