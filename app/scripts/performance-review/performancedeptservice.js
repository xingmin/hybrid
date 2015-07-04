define(['./module', 'lodash', 'moment'],function(performance, _, moment){
	'use strict';
    performance.factory("performanceDeptService",['$http','$q' ,function($http, $q){
        var _service = {};
        var _deptList = null;
        var _getPerformanceDepts = function(py){
            var defered =$q.defer();
            var params = {
                py: py
            };
            $http.get('/performance/',{params: params}).success(
                function(depts){
                    _deptList = depts;
                    defered.resolve(depts);
                }
            ).error(
                function(err){
                    _deptList = [];
                    defered.reject(new Error('获取失败'));
                }
            );
            return defered.promise;
        };
        var _createNew = function(deptName, pinYin, oaDeptId){
            var defered =$q.defer();
            $http.post('/performance/',{
                'deptName':deptName,
                'pinYin': pinYin,
                'OADeptId': oaDeptId
            }).success(
                function(data){
                    if(data.code !== 0){
                        defered.reject(new Error(data.message));
                        return;
                    }
                    _deptList.push(data.value);
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
            $http.delete('/performance/'+id).success(
                function(data){
                    if(data.code !== 0) {
                        defered.reject(false);
                        return;
                    }
                    var index = _.findIndex(_deptList, {deptId: id});
                    _.isArray(_deptList) && _deptList.splice(index, 1);
                    defered.resolve(true);
                }
            ).error(
                function(){
                    defered.reject(false);
                }
            );
            return defered.promise;
        };
        var _update = function(deptId, deptName, pinYin, oaDeptId){
            var defered =$q.defer();
            $http.post('/performance/',{
                'deptId': deptId,
                'deptName':deptName,
                'pinYin': pinYin,
                'OADeptId': oaDeptId
            }).success(
                function(data){
                    if(data.code !== 0){
                        defered.reject(new Error(data.message));
                        return;
                    }
                    var index = _.findIndex(_deptList, {deptId: id});
                    if(_.isArray(_deptList)){
                        _deptList[index].deptName = deptName;
                        _deptList[index].pinYin = pinYin;
                        _deptList[index].OADeptId = oaDeptId;
                    }
                    defered.resolve(data.value);
                }
            ).error(
                function(err){
                    defered.reject(new Error(err.message));
                }
            );
            return defered.promise;
        };

        _service.getPerformanceDepts = _getPerformanceDepts;
        _service.createNew = _createNew;
        _service.update = _update;
        _service.delete = _delete;
        return _service;
	}]);
});

