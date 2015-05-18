define(['../module'],function(services){
	'use strict';
	services.factory("AuthInterceptor",
		['$q', '$location', 'AuthValue',
		 function($q, $location, AuthValue){
			return {
				request : function(config){
					config.headers = config.headers || {};
					var accessToken = !AuthValue.hasOwnProperty('authToken') ? '': AuthValue.authToken.access_token;
					if (accessToken && accessToken.length>0){
						config.headers.Authorization = 'Bearer ' + accessToken;
					}
					return config;
				},
				responseError : function(response){
					var isLogin = !AuthValue.hasOwnProperty('isLogin') ?  false : AuthValue.isLogin;
					console.log(response.status);
					if (!isLogin && response.status === 401){
						$location.path('/auth/login');
					}
					return response;
				}
			};
	}]);
});

