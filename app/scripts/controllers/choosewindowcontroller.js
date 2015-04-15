define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('chooseWindowController',['$scope','$http','$timeout','windowService','userService',function($scope,$http,$timeout, windowService, userService){
    	$scope.callWindows =null;
    	$scope.currentWindow = null;
    	$scope.msgs=[];
    	windowService.getUserAvilableWindowDetail(userService.getCurrentUser().id).success(function(data){
    		$scope.callWindows = data.value;
    		$scope.callWindows.forEach(function(win){
    			if(win.isactive){
    				$scope.currentWindow = win;
    			}
    		});
    	});
    	$scope.activeWindow = function(current){
    		$scope.callWindows.forEach(function(win){
    			win.isactive=false;
    			if(win == current){
    				win.isactive = true;
    				$scope.currentWindow = win;
    			}
    		});
    	}
    	$scope.saveActiveWindow = function(){    	 
			windowService.activeUserWindow(userService.getCurrentUser().id, $scope.currentWindow.id)
				.success(function(data){
					if(data.status==0){ 
						$scope.msgs.push('保存设置成功！');
					}else{
						$scope.msgs.push('保存设置失败！');
					}
			});
		 
    	};
 
 
    }]);
})
