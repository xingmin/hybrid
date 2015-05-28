define(['./module'],function(directives){
    'use strict';	
    directives.directive("menudirective",['AccessEntryService', 'AuthValue', function(AccessEntryService, AuthValue){
		return {
			restrict: 'E',
			controller: function($scope, $element, $attrs){
				$scope.currentUser = AuthValue.currentUser;
				$scope.accessEntry = AccessEntryService.accessEntry;
				$scope.$on( 'users.login', function(event, stat){
					AccessEntryService.refreshAccessEntry();
				});
				$scope.$on( 'users.logout', function(event, stat){
					AccessEntryService.refreshAccessEntry();
				});
			},
			replace: true,
			templateUrl: 'views/component/menu.html',
			link: function(scope, element, attrs){
			}
		};
	}]);
});





