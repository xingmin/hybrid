define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('userQueueController',['$scope','$http','$timeout','userService','queueService','md5',function($scope,$http,$timeout, userService, queueService,md5){
    	$scope.users =null;
    	$scope.queues = null;
    	$scope.msgs=[];
    	userService.getAllUsers().success(function(data){
    		$scope.users = data.value;
    	});
    	queueService.getAllQueues().success(function(data){
    		$scope.queues = data.value;
    		$scope.queues.forEach(function(win,idx){ 
    			win.selected = false;    	 
    		});  
    	});    		
    	
    	$scope.currentUser = null;
    	$scope.selectCurrentUser = function(user){
    		$scope.currentUser = user;
        	queueService.getUserAvilableQueue($scope.currentUser.id).success(function(data){        		 
        		$scope.queues.forEach(function(win,idx){
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
	    		var arrQueue = new Array();
	    		$scope.queues.forEach(function(win,idx){ 
	    			if(win.selected ){
	    				arrQueue.push(win.id);  	
	    			}
	    		});  
				queueService.saveUserAvilableQueues($scope.currentUser.id, arrQueue)
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
    }]);
})
