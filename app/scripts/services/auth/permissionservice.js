define(['../module'],function(services){
	'use strict';
	services.factory("permissionService",['$http','$rootScope',function($http, $rootScope){
		var _permissions = [];
		var _init = false;
		var _getAllPermissonList = function(){
			if(_init){
				return _permissions;
			}
			$http.get('/authapi/permission/').success(
				function(data){
					if(data.code === 0){
						data.value.forEach(function(val){
							_permissions.splice(-1, 0, val);	
						});
					}
					$rootScope.$broadcast( 'permission.update', data.code);
				}
			);
			_init = true;
			return _permissions;
		};
		return{
			getAllPermissionList : _getAllPermissonList,
			getPermissons : function(){
				return $http.get('/authapi/permission/');
			},
			createNewPermission : function(action, resource){
				return $http.post('/authapi/permission/',
					{
						permissionInfo:{
							action  : action,
							resource : resource
						}
					}
				);
			},
			deletePermission : function(action, resource){
				return $http.post('/authapi/permission/delete/',
					{
						permissionInfo:{
							action  : action,
							resource : resource
						}
					}
				);
			}
		};
	}]);
});

