define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('userController',['$scope','$http','$timeout','userService','md5',function($scope,$http,$timeout, userService, md5){
    	$scope.users =null;
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	userService.getAllUsers().success(function(data){
    		$scope.users = data.value;
    	});
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if ($scope.mode == 'edit'){
    			$scope.currentedit.newval.pwd = md5.createHash($scope.currentedit.newval.pwd || '');
    			userService.saveChangeUser($scope.currentedit.newval.id,
    					$scope.currentedit.newval.name,
    					$scope.currentedit.newval.loginid,
    					$scope.currentedit.newval.pwd,
    					$scope.currentedit.newval.empcode
    					)
    				.success(function(data){
    					if(data.status==0){
    						$scope.currentedit.oldval.name = $scope.currentedit.newval.name;
        					$scope.currentedit.oldval.loginid  = $scope.currentedit.newval.loginid;
        					$scope.currentedit.oldval.pwd  = $scope.currentedit.newval.pwd;
        					$scope.currentedit.oldval.empcode  = $scope.currentedit.newval.empcode;
    						$scope.isSaveCompleted = true;
    						$scope.msgs.push($scope.currentedit.newval.name+'修改成功！');
    					}});
    		}else if($scope.mode == 'create'){
    			$scope.currentedit.newval.pwd = md5.createHash($scope.currentedit.newval.pwd || '');
    			userService.createNewUser($scope.currentedit.newval.name,
    					$scope.currentedit.newval.loginid,
    					$scope.currentedit.newval.pwd,
    					$scope.currentedit.newval.empcode)
    			.success(function(data){
    				if(data.status==0){
    					$scope.users.push(data.value);
    					$scope.isSaveCompleted = true;
    					$scope.msgs.push(data.value.name+'创建成功！');
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
    		userService.delUser(cur.id).success(function(data){
    			if(data.status==0){
    				angular.forEach( $scope.users, function(val,index){
    					if(val == cur){
    						$scope.currentedit={newval:{},oldval:{}};
    						$scope.users.splice(index,1);						
    						$scope.IsHideModal = true;				
    						$scope.msgs.push(val.name+'删除成功！');
    					}
    				
    				})
    			}else{
    				$scope.msgs.push(data.message);
    			}
    		});

    	};
    }]);
})
