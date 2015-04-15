define(['./module'],function(services){
    'use strict';
	services.factory("userService",['$http','$rootScope',function($http, $rootScope){
		 var _getUserInfoByPwd=function(loginid, password){
			  return $http.post('/queue/user/querybypwd/', {
				  'loginid':loginid,
				  'pwd':password}); 
		 }
		
		var _user;
		var _getCurrentUser = function(){
			return _user;
		};
		var _userLogin = function(loginid,password){
//			if(_user){
//				return _user;
//			}
			_getUserInfoByPwd(loginid,password).success(function(data){
				if(data.status==0 && data.value){
					_user = data.value;
					$rootScope.$broadcast('userok');
					//$scope.msgs.push('Login succeeded!')					
				}else{
					$rootScope.$broadcast('userno');
				}
			});
		};
		
	  return{
		  getAllUsers:function(){
			  return $http.get('/queue/user/');
		  },
		  delUser:function(id){
			  return $http.post('/queue/user/delete/', {'id':id});
		  },
		  createNewUser:function(name, loginid, password, empcode){
			  return $http.post('/queue/user/create/', {'name':name,
				  'loginid':loginid,
				  'pwd':password,
				  'empcode':empcode});
		  },
		  saveChangeUser:function(id, name, loginid, password, empcode){
			  return $http.post('/queue/user/update/', {'id':id, 
				  'name':name,
				  'loginid':loginid,
				  'pwd':password,
				  'empcode':empcode}); 
			  }
		  ,
		  getCurrentUser: _getCurrentUser,
		  getUserInfoByPwd: _getUserInfoByPwd,
		  userLogin : _userLogin
	};
	}])
})

