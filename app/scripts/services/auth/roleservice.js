define(['../module', 'lodash'],function(services, _){
	'use strict';
	services.factory("roleFactory",['$http','$rootScope',function($http, $rootScope){
		var rolefactory = {};
		var _roles = [];
		var _getRoles = function(){
			$http.get('/authapi/roles/').success(
				function(data){
					if(data.code === 0){
						data.value.forEach(function(val){
							_roles.splice(-1, 0, val);	
						});
					}
					$rootScope.$broadcast( 'role.update', data.code);
				}
			);
		};
		
		var _saveNewRole = function(name){
			$http.post('/authapi/roles/', 
				{
					roleInfo: {
						name:name
					}
				}
			).success(
					function(data){
						if(data.code === 0){
							_roles.push({name:name});
						} 
						$rootScope.$broadcast( 'role.created', data.code);
					}
			);
		};
		var _delRole = function(name){
			$http.post('/authapi/roles/delete/',
				{
					roleInfo:{
						name : name
					}
				}
			)
			.success(
				function(data){
					if(data.code === 0){
	    				angular.forEach( _roles, function(val,index){
	    					if(val.name == name){
	    						_roles.splice(index,1);						
	    					}			
	    				});
					} 
					$rootScope.$broadcast( 'role.deleted', data.code);
				}
			);
		};
		rolefactory.delRole = _delRole;
		rolefactory.getRoles = _getRoles;
		rolefactory.saveNewRole = _saveNewRole;
		rolefactory.roles = _roles;
		return rolefactory;
	}]);
});

