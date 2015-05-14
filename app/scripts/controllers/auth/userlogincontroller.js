define(['../module'],function(controllers,$){
    'use strict';
    controllers.controller('userLoginController',
    		['$scope','$http','$timeout','$location','userService',
    		 function($scope,$http,$timeout, $location, userService){
    	$scope.formData = {userloginid:'',userpassword:''}
    	$scope.msgs=[];
    	$scope.$on('users.login',function(event, passed){
    		if(passed){
    			$scope.msgs.push('Login successfull!')
    		}else{
    			$scope.msgs.push('Login failed!')
    		}    		
    	});
    	$scope.login=function(){
    		userService.userLogin($scope.formData.userloginid, $scope.formData.userpassword);
    	}
    }]);
})
