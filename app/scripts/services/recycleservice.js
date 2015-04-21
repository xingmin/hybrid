define(['./module'],function(services){
	'use strict';
	services.factory("recycleService",['$http',function($http){
		return{
				createNewRecycle : function(returner, recycler, remark, recycleDetails){
					return $http.post('/opsupport/recycle/create/',
						{
							'returner':returner,
							'recycler' : recycler,
							'remark':remark,
							'recycleDetails' : recycleDetails,
						});
				},
				getRecycleById : function(id){
					return $http.post('/opsupport/recycle/'+id);
				},
				getRecycleDetails : function(id){
					return $http.post('/opsupport/recycle/detail/'+id);
				}

		  };
	}])
});

