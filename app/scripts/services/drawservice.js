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
			  createNewDraw:function(barcode, receiver, drawer, consumer, remark){
				  return $http.post('/opsupport/draw/create/', {
					  'barcode' : barcode,
					  'receiver':receiver,
					  'drawer':drawer,
					  'consumer':consumer,
					  'remark' : remark
					  });
			  },
			  saveChangeDraw:function(id, barcode, receiver, drawer, consumer, useFlag, recyler, remark){
				  return $http.post('/opsupport/draw/update/', 
						  {
							  'id':id,
							  'barcode': barcode,							  
							  'receiver':receiver,
							  'drawer':drawer,
							  'consumer':consumer,
							  'useFlag':useFlag,
							  'recyler':recyler,
							  'remark':remark
							  
						  }
				  ); 
			  }
		  };
	}])
});

