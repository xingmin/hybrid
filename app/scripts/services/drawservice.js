define(['./module'],function(services,$){
	'use strict';
	services.factory("drawService",['$http',function($http){
		  return{
			  getDrawsByDate:function(dBegin, dEnd){
				  return $http.get('/opsupport/draw/q?b='+dBegin+'&e='+dEnd);
			  },
			  deleteDraw:function(id){
				  return $http.post('/opsupport/draw/delete', {'id':id});
			  },
			  createNewDraw:function(receiver, drawer, consumer){
				  return $http.post('/opsupport/draw/create/', {
					  'receiver':receiver,
					  'drawer':drawer,
					  'consumer':consumer
					  });
			  },
			  saveChangeDraw:function(id, receiver, drawer, consumer){
				  return $http.post('/opsupport/draw/update/', {'id':id,
					  'receiver':receiver,
					  'drawer':drawer,
					  'consumer':consumer}); 
			  }
		  };
	}])
});

