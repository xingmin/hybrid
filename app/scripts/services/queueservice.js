"use strict";

angular.module('app')
.factory("queueService",['$http',function($http){
	  return{
		  getAllQueues:function(){
			  return $http.get('/queue/queue/');
		  },
		  delQueue:function(id){
			  return $http.post('/queue/queue/delete/', {'id':id});
		  },
		  createNewQueue:function(name, maxCallTimes, queueClassId, isActive){
			  return $http.post('/queue/queue/create/', {'name':name,
				  'maxCallTimes':maxCallTimes, 
				  'queueClassId':queueClassId,
				  'isActive':isActive});
		  },
		  saveChangeQueue:function(id,name, maxCallTimes, queueClassId, isActive){
			  return $http.post('/queue/queue/update/', {'id':id,
				  'name':name,
				  'maxCallTimes':maxCallTimes,
				  'queueClassId':queueClassId,
				  'isActive':isActive}); 
		  }
	  };
}]);

