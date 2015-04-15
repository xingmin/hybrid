define(['./module'],function(services,$){
    'use strict';
	services.factory("queueClassService",['$http',function($http){
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
			  createNewQueueClass:function(name, mode, py, externalSysId){
				  return $http.post('/queue/queueclass/create/', {'classname':name,
					  'classmode':mode,
					  'pinyin':py,
					  'externalSysId':externalSysId});
			  },
			  saveChangeQueueClass:function(id, name, mode, py, externalSysId){
				  return $http.post('/queue/queueclass/update/', {'classname':name,
					  'classid':id,
					  'classmode':mode,
					  'pinyin':py,
					  'externalSysId':externalSysId}); 
			  }
		  };
	}])
});

