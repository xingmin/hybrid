define(['./module'],function(directives){
    'use strict';	
    directives.directive("login",['AuthService', function(AuthService){
		  return{
		    restrict: 'E',
		    scope: {
		    	loginTarget:'@loginTarget'
		    },
		    controller: function($scope, $element, $attrs){
		    	$scope.loginState = '登录';
		    	$scope.$on('users.login', function(event, isLogin){
		    		if(isLogin){
		    			$scope.loginState = '退出';
		    		}
		    	});
		    	$scope.$on('users.logout', function(event, isLogin){	    			
	    			$scope.loginState = '登录';
		    	});
		    },
		    replace: true,
		    template: '<a href="{{loginTarget}}">{{loginState}}</a>',
		    link: function(scope, element, attrs){
		    	element.bind('click', function(){
		    		if(!AuthService.isLogin()){
		    			return;
		    		}
		    		AuthService.logout();
		    	});
		    }
		  }
	}]);
});





