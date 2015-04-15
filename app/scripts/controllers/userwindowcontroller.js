define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('userWindowController',['$scope','$http','$timeout','userService','windowService','md5',function($scope,$http,$timeout, userService, windowService,md5){
    	$scope.users =null;
    	$scope.windows = null;
    	$scope.msgs=[];
    	userService.getAllUsers().success(function(data){
    		$scope.users = data.value;
    	});
    	windowService.getAllWindows().success(function(data){
    		$scope.windows = data.value;
    		$scope.windows.forEach(function(win,idx){ 
    			win.selected = false;    	 
    		});  
    	});    		
    	
    	$scope.currentUser = null;
    	$scope.selectCurrentUser = function(user){
    		$scope.currentUser = user;
        	windowService.getUserAvilableWindow($scope.currentUser.id).success(function(data){        		 
        		$scope.windows.forEach(function(win,idx){
        			if(data.value && data.value.indexOf(win.id)>=0){
        				win.selected = true;
        			}else{
        				win.selected = false;
        			}
        		});        	 
        	});  
    	}
    	$scope.saveChange = function(){
    		if($scope.currentUser){    		
	    		var arrWindow = new Array();
	    		$scope.windows.forEach(function(win,idx){ 
	    			if(win.selected ){
	    				arrWindow.push(win.id);  	
	    			}
	    		});  
				windowService.saveUserAvilableWindows($scope.currentUser.id, arrWindow)
					.success(function(data){
						if(data.status==0){
							$scope.msgs.push('保存成功！');
						}else{
							$scope.msgs.push('保存失败！');
						}
						});
    		}else{
    			$scope.msgs.push('选择待设置用户！');
    		}
    	 
    	};
//    	//create --新建
//    	//edit --编辑
//    	//del --删除
//    	$scope.changeEditMode = function(mode){
//    		$scope.mode = mode;
//    		if(mode == 'create'){
//    			$scope.currentedit={newval:{},oldval:{}};
//    		}
//    	}
//    	$scope.deletecur = function(){
//    		var cur = $scope.currentedit.oldval;
//    		$scope.IsHideModal = false;
//    		userService.delUser(cur.id).success(function(data){
//    			if(data.status==0){
//    				angular.forEach( $scope.users, function(val,index){
//    					if(val == cur){
//    						$scope.currentedit={newval:{},oldval:{}};
//    						$scope.users.splice(index,1);						
//    						$scope.IsHideModal = true;				
//    						$scope.msgs.push(val.name+'删除成功！');
//    					}
//    				
//    				})
//    			}else{
//    				$scope.msgs.push(data.message);
//    			}
//    		});
//
//    	};
    }]);
})
