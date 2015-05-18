define(['../module'],function(controllers,$){
    'use strict';
    controllers.controller('userLoginController',
    		['$scope','$http','$timeout','$location','AuthService',
    		 function($scope,$http,$timeout, $location, AuthService){
    	$scope.formData = {userloginid:'',userpassword:''}
    	$scope.msgs=[];
    	$scope.$on('users.login',function(event, passed){
    		if(passed){
    			$scope.msgs.push('Login successfull!')
    			$location.path('/');
    		}else{
    			$scope.msgs.push('Login failed!')
    		}    		
    	});
    	$scope.login=function(){
    		AuthService.requestAccessToken($scope.formData.userloginid, $scope.formData.userpassword);
    	}
    }]);
})
