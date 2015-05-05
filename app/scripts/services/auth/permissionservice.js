define(['../module'],function(services){
	'use strict';
	services.factory("permissionService",['$http','$rootScope',function($http, $rootScope){
		return{
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

