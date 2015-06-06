define(['../module', 'lodash'],function(services, _){
	'use strict';
	services.factory("oproomService",['$http','$rootScope', '$q',function($http, $rootScope, $q){
		var service = {};
		var _oprooms = [];
		var _allOpRooms = null;
		var _init = false;
		var _getOprooms = function(options){
//			if(_init){
//				return _oprooms;
//			}
			_oprooms.splice(0, _oprooms.length);
            _getOproomsPromise(options).success(
				function(data){
					if(data.code === 0){
						data.value.forEach(function(val){
							_oprooms.splice(-1, 0, val);
						});
					}
					$rootScope.$broadcast( 'oprooms.refresh', data);
				}
			).error(
				function(err){
					$rootScope.$broadcast( 'oprooms.refresh', {code: false, value: err});
				}
			);
//			_init = true;
			return _oprooms;
		};
		var _getOproomsPromise = function(options){
            options = options || {};
			var params = {};
			if(options.name) params.name = options.name;
			return $http.get('/opsupport/oprooms/', {params: params});
		};
		var _getAllOpRoomsQ = function(){
			var defered = $q.defer();
			if(_allOpRooms !== null){
				defered.resolve(_allOpRooms);
				return defered.promise;
			}
			_getOproomsPromise()
				.success(function(data){
					if(data.code === 0){
						_allOpRooms = data.value;
					}else{
						_allOpRooms = [];
					}
					defered.resolve(_allOpRooms);
				})
				.error(function(err){
					_allOpRooms = [];
					defered.reject(_allOpRooms);
				});
			return defered.promise;
		};
		var _saveNewOproom = function(name){
			$http.post('/opsupport/oprooms/',
				{
					name: name
				}
            ).success(
				function(data){
                    var ret = {};
					if(data && data.code === 0){
						_oprooms.push(data.value);
                        ret = {code: true, msg: "创建成功！"};
					}else{
                        ret = {code: false, msg: "保存失败"};
                    }
                    $rootScope.$broadcast( 'oprooms.created', ret);
				}
            ).error(
                function(err){
                    $rootScope.$broadcast( 'oprooms.created', {code: false, msg: err});
                }
            );
		};
		var _delOproom = function(name){
			$http.delete('/opsupport/oprooms/'+name).success(
				function(data){
                    var ret = null;
					if(data.code === 0){
                        var idx = _.findIndex(_oprooms, {name: name});
                        if(idx>=0){
                            _oprooms.splice(idx,1);
                            ret = {code: true, msg: '删除成功'};
                        }
					}else{
                        ret = {code: false, msg:  "保存失败"};
                    }
					$rootScope.$broadcast( 'oprooms.deleted', ret);
				}
            ).error(
                function(err){
                    $rootScope.$broadcast( 'oprooms.deleted', {code: false, msg: err});
                }
            );
		};
		service.getAllOpRooms = _getAllOpRoomsQ
		service.getOproomsPromise = _getOproomsPromise;
        service.getOprooms = _getOprooms;
        service.saveNewOproom = _saveNewOproom;
        service.delOproom = _delOproom;
        service.oprooms = _oprooms;
		return service;
	}]);
});

