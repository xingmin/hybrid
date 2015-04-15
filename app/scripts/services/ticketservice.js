define(['./module'],function(services,$){
    'use strict';
	services.factory("ticketService",['$http',function($http){
		  return{
			  getQueuingTicketsByQueueId:function(queueid){
				  return $http.get('/queue/ticket/queuing/queueid/'+queueid);
			  }
		  };
	}])
});

