define(['./module'],function(services,$){
    'use strict';
	services.factory("dictService",['$http',function($http){
		var _getQueueStatus = function(){
			return $http.get('/dict/queuestatus/');
		};
		return{
			getQueueStatus:_getQueueStatus
		};
	}]);
});

