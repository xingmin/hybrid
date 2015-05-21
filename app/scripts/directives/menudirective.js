define(['./module'],function(directives){
    'use strict';	
    directives.directive("menudirective",['AccessEntryService', function(AccessEntryService){
		  return{
		    restrict: 'E',
		    controller: function($scope, $element, $attrs){
		    	$scope.accessEntry = AccessEntryService.accessEntry;
		    	$scope.$on( 'users.login', function(event, stat){
		    		if(stat){
		    			AccessEntryService.refreshAccessEntry();
		    		};
		    	});
		    	$scope.$on( 'users.logout', function(event, stat){
		    		if(stat){
		    			AccessEntryService.refreshAccessEntry();
		    		};
		    	});
		    },
		    replace: true,
		    templateUrl: 'views/component/menu.html',
		    link: function(scope, element, attrs){
		    }
		  }
	}]);
});





