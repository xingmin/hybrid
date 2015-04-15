define(['./module'],function(services){
    'use strict';
	services.factory("queueService",['$http',function($http){
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
	},
	getUserAvilableQueue:function(userid){
		return $http.get('/queue/queue/userqueue/'+userid);
	},
	getUserAvilableQueueDetail:function(userid){
		return $http.get('/queue/queue/userqueue/detail/'+userid);
	},
	saveUserAvilableQueues:function(userid,arrQueues){
		return $http.post('/queue/queue/userqueue/update/', {'userid':userid, 'queueid':arrQueues});
	}
	,
	getQueueInfoByClassId:function(classid){
		return $http.get('/queue/queue/querybyclassid/'+classid);
	}
	};
	}]);
});

