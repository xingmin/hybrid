define(['../module'],function(controllers,$){
    'use strict';
    controllers.controller('userLoginController',
    		['$scope','$http','$timeout','$location','AuthService','AccessEntryService','messageService',
    		 function($scope,$http,$timeout, $location, AuthService, AccessEntryService, messageService){
    	$scope.formData = {userloginid:'',userpassword:''}
    	$scope.msgs=[];
    	$scope.$on('users.login',function(event, passed){
    		if(passed){
				messageService.sendMessage('Login successfull!');
    			$location.path('/');
    		}else{
				messageService.sendMessage('Login failed!')
    		}
    	});
    	$scope.login=function(){
    		AuthService.requestAccessToken($scope.formData.userloginid, $scope.formData.userpassword);
    	};

    }]);
})
