define(['./module'],function(services,$){
    'use strict';
	services.factory("windowService",['$http',function($http){
	  return{
		  getAllWindows:function(){
			  return $http.get('/queue/window/');
		  },
		  delWindow:function(id){
			  return $http.post('/queue/window/delete/', {'id':id});
		  },
		  createNewWindow:function(name){
			  return $http.post('/queue/window/create/', {'name':name});
		  },
		  saveChangeWindow:function(id,name){
			  return $http.post('/queue/window/update/', {'id':id, 'name':name}); 
		  },
		  getUserAvilableWindow:function(userid){
			  return $http.get('/queue/window/userwindow/'+userid);
		  },
		  getUserAvilableWindowDetail:function(userid){
			  return $http.get('/queue/window/userwindow/getdetail/'+userid);
		  },
		  saveUserAvilableWindows:function(userid,arrWindows){
			  return $http.post('/queue/window/userwindow/update/', {'userid':userid, 'windowid':arrWindows});
		  },
		  activeUserWindow:function(userid,windowid){
			  return $http.post('/queue/window/userwindow/active/', {'userid':userid, 'windowid':windowid});
		  },
	}
	}])
})

