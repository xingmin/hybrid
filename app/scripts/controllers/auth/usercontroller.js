define(['../module', 'bootstrap-toggle'],function(controllers){
    'use strict';
    controllers.controller('userController',
    		['$scope','$http','$timeout','userService','md5','roleFactory',
    		 function($scope,$http,$timeout, userService, md5,roleFactory){
    	$scope.users = userService.getUsers();
    	$scope.roles = roleFactory.getRoles();
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if ($scope.mode == 'edit'){
    			$scope.currentedit.newval.password = $scope.currentedit.newval.password;
    			userService.saveUserChange(
                    $scope.currentedit.newval.userId,
                    $scope.currentedit.newval.legalName,
                    $scope.currentedit.newval.userName,
                    $scope.currentedit.newval.password,
                    $scope.currentedit.newval.role,
					$scope.currentedit.newval.empCode,
                    $scope.currentedit.newval.legalNamePY
    			);
    		}else if($scope.mode == 'create'){
    			$scope.currentedit.newval.password = $scope.currentedit.newval.password;
    			userService.createNewUser(
                    $scope.currentedit.newval.legalName,
                    $scope.currentedit.newval.userName,
                    $scope.currentedit.newval.password,
                    $scope.currentedit.newval.role,
                    $scope.currentedit.newval.empCode,
                    $scope.currentedit.newval.legalNamePY
    			);	
    		}
    	};
    	$scope.$on('users.update', function(event, code){
    		if(code === 0){
    			$scope.msgs.push('保存成功');
    		}else{
    			$scope.msgs.push('保存失败');
    		}
    		$scope.isSaveCompleted = true;
    	});
    	$scope.$on('users.created', function(event, code){
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
    		userService.delUser(cur.userId);
    	};
    	$scope.$on('users.delete', function(event, code){
    		if(code === 0){
    			$scope.msgs.push('保存成功');
    		}else{
    			$scope.msgs.push('保存失败');
    		}
    		$scope.IsHideModal = true;
    	});
    	$scope.selectRole = function(role){
    		$scope.currentedit.newval.role = role.name;
    	};
    }]);
})
