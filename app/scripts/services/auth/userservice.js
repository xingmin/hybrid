define(['../module'],function(services){
	'use strict';
	services.factory("userService",['$http','$rootScope',function($http, $rootScope){
		return{
			getUsers : function(){
				return $http.get('/authapi/users/');
			},
			createNewUser : function(legalname, username, password){
				return $http.post('/authapi/users/',
					{
						userinfo:{
							userName  : username,
							legalName : legalname,
							password  : password
						}
					}
				);
			},
			saveUserChange : function(userid, legalname, username, password){
				return $http.post('/authapi/users/update',
					{
						userinfo:{
							userId    : userid,
							userName  : username,
							legalName : legalname,
							password  : password
						}
					}
				);
			}
		};
	}]);
});

