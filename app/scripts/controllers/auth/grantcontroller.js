define(['../module', 'lodash'],function(controllers, _){
    'use strict';
    controllers.controller('grantController',
    		['$scope','$http','$timeout','roleFactory','permissionService',
    		 function($scope,$http,$timeout, roleFactory,permissionService){
    	$scope.msgs=[];
    	$scope.roles = roleFactory.getRoles();
    	$scope.permissions = permissionService.getAllPermissionList();
    	$scope.$on('role.update', function(code){
    		if(code === 0){
    			$scope.msgs.push('获取成功');
    		}
    	});
    	
    	$scope.currentRole = null;
    	$scope.selectRole = function(role){
    		$scope.currentRole = role;
    		angular.forEach($scope.roles, function(rl){
    			if(rl === role){
    				rl.selected = true;
    			}else{
    				rl.selected = false;
    			}
    		});
    		angular.forEach($scope.permissions,function(perm){
    			perm.selected = false;
    		});
    		angular.forEach($scope.currentRole.grants, function(grant){
        		var idx = _.findIndex($scope.permissions, function(permission){
        			return (grant.action === permission.action && grant.resource === permission.resource);        			
        		});
        		$scope.permissions[idx].selected = true;
        	});
    	};
    	
    	$scope.grant = function(permission){
    		if(permission.selected){
    			roleFactory.grantPermissionToRole($scope.currentRole.name, permission.resource, permission.action);
    		}else{
    			roleFactory.revokePermissionFromRole($scope.currentRole.name, permission.resource, permission.action);
    		}
    	};
    }]);
})
