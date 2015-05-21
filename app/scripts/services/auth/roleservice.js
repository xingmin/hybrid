define(['../module', 'lodash'],function(services, _){
	'use strict';
	services.factory("roleFactory",['$http','$rootScope',function($http, $rootScope){
		var rolefactory = {};
		var _roles = [];
		var _init = false;
		var _getRoles = function(){
//			if(_init){
//				return _roles;
//			}
			_roles = [];
			$http.get('/authapi/roles/')
				.then(
					function(recv){
						var data = recv.data;
						if(data.code === 0){
							data.value.forEach(function(val){
								_roles.splice(-1, 0, val);	
							});
						}
						_refreshRoleGrants();
						$rootScope.$broadcast( 'role.update', data.code);
					},
					function(err){
						console.log(err);
					}
				)
//			_init = true;
			return _roles;
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
							_refreshRoleGrants(name);
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
		var _getRoleGrants = function(roleName){
			$http.get('/authapi/roles/'+ roleName +'/grants/').success(
				function(data){
					_roles.every(function(role){
						if(role.name === roleName){
							role.grants = data.value;
							return false;
						}
						return true;
					});
				}
			);
		};
		var _refreshRoleGrants = function(roleName){
			if(roleName){
				_getRoleGrants(roleName);
				return;
			};
			angular.forEach(_roles, function(role){
				_getRoleGrants(role.name);
			});
		};
		var _grantPermissionToRole = function(role, resource, action){
			$http.post('/authapi/roles/' + role + '/grant/',
					{
						permissionInfo:{
							resource : resource,
							action   : action
						}
					}
				)
				.success(
					function(data){
						_refreshRoleGrants(role);
						$rootScope.$broadcast( 'role.grant', data.code);
					}
				);
		};
		var _revokePermissionFromRole = function(role, resource, action){
			$http.post('/authapi/roles/' + role + '/revoke/',
					{
						permissionInfo:{
							resource : resource,
							action   : action
						}
					}
				)
				.success(
					function(data){
						_refreshRoleGrants(role);
						$rootScope.$broadcast( 'role.revoke', data.code);
					}
				);
		};
		rolefactory.delRole = _delRole;
		rolefactory.getRoles = _getRoles;
		rolefactory.saveNewRole = _saveNewRole;
		rolefactory.roles = _roles;
		rolefactory.refreshRoleGrants = _refreshRoleGrants;
		rolefactory.grantPermissionToRole = _grantPermissionToRole;
		rolefactory.revokePermissionFromRole = _revokePermissionFromRole;
		return rolefactory;
	}]);
});

