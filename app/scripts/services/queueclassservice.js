"use strict";

angular.module('app')
.factory("queueClassService",['$http',function($http){
	  return{
		  getAllQueueClasses:function(){
			  return $http.get('/queue/queueclass/');
		  },
		  getQueueClassesByPinyin:function(py){
			  return $http.get('/queue/queueclass/get/py/'+py);
		  },
		  delQueueClass:function(id){
			  return $http.post('/queue/queueclass/delete/', {'classid':id});
		  },
		  createNewQueueClass:function(name){
			  return $http.post('/queue/queueclass/create/', {'classname':name});
		  },
		  saveChangeQueueClass:function(id,name){
			  return $http.post('/queue/queueclass/update/', {'classname':name, 'classid':id}); 
		  }
	  };
}]);

