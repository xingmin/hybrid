define(['../module'],function(controllers,$){
    'use strict';
    controllers.controller('userController',
    		['$scope','$http','$timeout','userService','md5','roleFactory',
    		 function($scope,$http,$timeout, userService, md5,roleFactory){
    	$scope.users =null;
    	$scope.roles = roleFactory.getRoles();
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	userService.getUsers().success(function(data){
    		$scope.users = data.value;
    	});
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if ($scope.mode == 'edit'){
    			$scope.currentedit.newval.password = md5.createHash($scope.currentedit.newval.password || '');
    			userService.saveUserChange($scope.currentedit.newval.userId,
    					$scope.currentedit.newval.legalName,
    					$scope.currentedit.newval.userName,
    					$scope.currentedit.newval.password,
    					$scope.currentedit.newval.role
    					)
    				.success(function(data){
    					if(data.code === 0){
    						$scope.isSaveCompleted = true;
    						$scope.currentedit.oldval.legalName = $scope.currentedit.newval.legalName;
        					$scope.currentedit.oldval.userName = $scope.currentedit.newval.userName;
        					$scope.currentedit.oldval.role = $scope.currentedit.newval.role;
    						$scope.msgs.push($scope.currentedit.newval.legalName+'修改成功！');
    					}});
    		}else if($scope.mode == 'create'){
    			$scope.currentedit.newval.password = md5.createHash($scope.currentedit.newval.password || '');
    			userService.createNewUser($scope.currentedit.newval.legalName,
    					$scope.currentedit.newval.userName,
    					$scope.currentedit.newval.password,
    					$scope.currentedit.newval.role)
    			.success(function(data){
    				if(data.code === 0){
    					$scope.users.push(data.value);
    					$scope.isSaveCompleted = true;
    					$scope.msgs.push('创建成功！');
    				}});	
    		}
    	};
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
    		userService.delUser(cur.userId).success(function(data){
    			if(data.code === 0){
    				angular.forEach( $scope.users, function(val,index){
    					if(val == cur){
    						$scope.currentedit={newval:{},oldval:{}};
    						$scope.users.splice(index,1);						
    						$scope.IsHideModal = true;				
    						$scope.msgs.push('删除成功！');
    					}    				
    				})
    			}else{
    				$scope.msgs.push(data.message);
    			}
    		});

    	};
    	$scope.selectRole = function(role){
    		$scope.currentedit.newval.role = role.name;
    	};
    }]);
})
