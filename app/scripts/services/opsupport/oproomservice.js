define(['../module', 'lodash'],function(services, _){
	'use strict';
	services.factory("oproomService",['$http','$rootScope',function($http, $rootScope){
		var service = {};
		var _oprooms = [];
		var _init = false;
		var _getOprooms = function(){
//			if(_init){
//				return _oprooms;
//			}
			_oprooms = [];
			$http.get('/opsupport/oprooms/').success(
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
		
		var _saveNewOproom = function(name){
			$http.post('/opsupport/oprooms/',
				{
					name: name
				}
            ).success(
				function(data){
					if(data.code === 0){
						_oprooms.push(data.value);
					}
					$rootScope.$broadcast( 'oprooms.created', data);
				}
            ).error(
                function(err){
                    $rootScope.$broadcast( 'oprooms.created', {code: false, value: err});
                }
            );
		};
		var _delOpRoom = function(name){
			$http.delete('/opsupport/oprooms/',
				{
				    name : name
				}
			).success(
				function(data){
					if(data.code === 0){
	    				angular.forEach( _oprooms, function(val,index){
	    					if(val.name == name){
	    						_oprooms.splice(index,1);						
	    					}			
	    				});
					} 
					$rootScope.$broadcast( 'oprooms.deleted', data);
				}
            ).error(
                function(err){
                    $rootScope.$broadcast( 'oprooms.deleted', {code: false, value: err});
                }
            );
		};
		rolefactory.getOprooms = _getOprooms;
		rolefactory.saveNewOproom = _saveNewOproom;
		rolefactory.delOpRoom = _delOpRoom;
		rolefactory.oprooms = _oprooms;
		return service;
	}]);
});

