define(['./module'],function(services){
	'use strict';
	services.factory("drawService",['$http',function($http){
		  return{
			  getDrawsByDate:function(dBegin, dEnd){
				  return $http.get('/opsupport/draw/q?b='+dBegin+'&e='+dEnd);
			  },
			  deleteDraw:function(id){
				  return $http.post('/opsupport/draw/delete', {'id':id});
			  },
			  createNewDraw:function(consumer, receiver, remark, drawer, barcodes){
				  return $http.post('/opsupport/draw/create/', 
						  {
							  'consumer':consumer,
							  'receiver':receiver,
							  'remark' : remark,
							  'drawer':drawer,
							  'barcodes' : barcodes,
						  });
			  },
			  saveChangeDraw:function(id, consumer, receiver, remark, drawer, barcodes){
				  return $http.post('/opsupport/draw/update/', 
						  {
							  'id':id,
							  'consumer':consumer,
							  'receiver':receiver,
							  'remark' : remark,
							  'drawer':drawer,
							  'barcodes' : barcodes,
							  
						  }
				  ); 
			  },
			  getDrawDetailsByDrawId:function(drawId){
				  return $http.get('/opsupport/draw/detail/'+drawId);
			  },
		  };
	}])
});

