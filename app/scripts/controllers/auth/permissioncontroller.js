define(['../module'],function(controllers,$){
    'use strict';
    controllers.controller('permissionController',
    		['$scope','$http','$timeout','permissionService','md5',
    		 function($scope,$http,$timeout, permissionService, md5){
    	$scope.permissions = permissionService.getPermissons();
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if($scope.mode == 'create'){
    			permissionService.createNewPermission(
    					$scope.currentedit.newval.action,
    					$scope.currentedit.newval.resource);
    		}
    	};
    	$scope.$on('permission.created', function(event, code){
    		if(code === 0){
    			$scope.msgs.push('保存成功');
    		}else{
    			$scope.msgs.push('保存失败');
    		}
    		$scope.isSaveCompleted = true;	
    	});
    	//create --新建
    	//edit --编辑
    	//del --删除
    	$scope.changeEditMode = function(mode){
    		$scope.mode = mode;
    		if(mode == 'create'){
    			$scope.currentedit={newval:{},oldval:{}};
    		}
    	}
    	$scope.deletecur = function(){
    		var cur = $scope.currentedit.oldval;
    		$scope.IsHideModal = false;
    		permissionService.deletePermission(cur.action, cur.resource);
    	};
    	$scope.$on('permission.deleted', function(event, code){
    		if(code === 0){
    			$scope.msgs.push('保存成功');
    		}else{
    			$scope.msgs.push('保存失败');
    		}
    		$scope.IsHideModal = true;
    	});
    }]);
})
