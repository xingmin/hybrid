define(['../module'],function(services){
	'use strict';
	services.factory("permissionService",['$http','$rootScope',function($http, $rootScope){
		var _permissions = [];
		var _init = false;
		var _getAllPermissonList = function(){
//			if(_init){
//				return _permissions;
//			}
			_permissions = [];
			$http.get('/authapi/permission/').success(
				function(data){
					if(data.code === 0){
						data.value.forEach(function(val){
							_permissions.splice(-1, 0, val);	
						});
					}
					$rootScope.$broadcast( 'permission.refreshed', data.code);
				}
			);
//			_init = true;
			return _permissions;
		};
		var _createNewPermission = function(action, resource){
			$http.post('/authapi/permission/',
				{
					permissionInfo:{
						action  : action,
						resource : resource
					}
				}
			).success(
				function(data){
					if(data.code === 0){
						_permissions.push({action:action, resource:resource});
					}						
					$rootScope.$broadcast( 'permission.created', data.code);
				}
			).error(function(data,status,headers,config){
				console.log(status);
			});
		};
		var _deletePermission = function(action, resource){
			$http.post('/authapi/permission/delete/',
				{
					permissionInfo:{
						action  : action,
						resource : resource
					}
				}
			) .success(
				function(data){
					if(data.code === 0){
	    				angular.forEach( _permissions, function(val,index){
	    					if(val.action === action && val.resource === resource){
	    						_permissions.splice(index,1);						
	    					}			
	    				});
					} 
					$rootScope.$broadcast( 'permission.deleted', data.code);
				}
			);
		};
		return{
			getAllPermissionList : _getAllPermissonList,
			getPermissons : _getAllPermissonList,
			createNewPermission : _createNewPermission,
			deletePermission : _deletePermission
		};
	}]);
});

