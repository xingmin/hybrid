define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('userLoginController',['$scope','$http','$timeout','$location','userService','md5',function($scope,$http,$timeout, $location, userService, md5){
    	$scope.formData = {userloginid:'',userpassword:''}
    	$scope.msgs=[];
    	$scope.$on('userok',function(){
    		$location.path('/queuesys/user/choosewindow');
    	})
    	$scope.$on('userno',function(){
    		$scope.msgs.push('Login failed!')
    	})
    	$scope.login=function(){    		
    		userService.userLogin($scope.formData.userloginid, md5.createHash($scope.formData.userpassword || ''));
//	    		.success(function(data){
//					if(data.status==0){
//						//$scope.msgs.push('Login succeeded!')
//						$location.path('/queuesys/user/choosewindow');
//					}else{
//						$scope.msgs.push('Login failed!')
//					}
//				});
    	}
    }]);
})
