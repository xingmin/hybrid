define(['./module'],function(services,$){
	'use strict';
	services.factory("externalSysService",['$http',function($http){
		  return{
			  getAllExternalSys:function(){
				  return $http.get('/queue/externalsys/');
			  },
			  getExternalSysByPinyin:function(py){
				  return $http.get('/queue/externalsys/get/py/'+py);
			  },
			  delExternalSys:function(id){
				  return $http.post('/queue/externalsys/delete/', {'id':id});
			  },
			  createNewExternalSys:function(name, pinyin, easyid){
				  return $http.post('/queue/externalsys/create/', {'name':name,
					  'pinyin':pinyin,
					  'easyid':easyid});
			  },
			  saveChangeExternalSys:function(id, name, pinyin, easyid){
				  return $http.post('/queue/externalsys/update/', {'id':id,
					  'name':name,
					  'pinyin':pinyin,
					  'easyid':easyid}); 
			  }
		  };
	}])
});

