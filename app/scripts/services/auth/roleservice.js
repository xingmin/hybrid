define(['../module'],function(services){
	'use strict';
	services.factory("roleFactory",['$http','$rootScope',function($http, $rootScope){
		var rolefactory = {};
		var _roles = [];
		var _getRoles = function(){
			$http.get('/authapi/roles/').success(
				function(data){
					if(data.code === 0){
						_roles = data.value;
					} 
					$rootScope.$broadcast( 'roles.update', data.code);
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
						$rootScope.$broadcast( 'roles.created', data.code);
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
					$rootScope.$broadcast( 'roles.deleted', data.code);
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

