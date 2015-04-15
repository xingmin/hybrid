define(['./module'],function(services,$){
    'use strict';
	services.factory("personService",['$http',function($http){
		  return{
			  getPersonById:function(personId){
				  return $http.get('/queue/person/'+personId);
			  }
		  };
	}])
});

