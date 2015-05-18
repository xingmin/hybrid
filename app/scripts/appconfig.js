define(["./appx"],
	function(app){
		return app.config(['$httpProvider', function($httpProvider){
				$httpProvider.interceptors.push('AuthInterceptor');
		}]);
});
