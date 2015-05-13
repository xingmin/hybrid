define(['../module'],function(services){
	'use strict';
	services.factory("userService",['$http', '$rootScope', 'md5',function($http, $rootScope, md5){
		var _users = [];
		var _init = false;
		var _currentUser = null;
		var _getUsers = function(){
			if(_init){
				return _users;
			}
			$http.get('/authapi/users/').success(function(data){
				if(data.code === 0){
					data.value.forEach(function(val){
						_users.splice(-1, 0, val);	
					});
				}
				$rootScope.$broadcast( 'users.refresh', data.code);
			});
			_init = true;
			return _users;
		};
		
		var _createNewUser = function(legalname, username, password, role){
			var userInfo = {
				userName  : username,
				legalName : legalname,
				password  : md5.createHash(password || ''),
				role      : role
			};
			$http.post('/authapi/users/',
				{
					"userinfo" : userInfo
				}
			).success(
				function(data){
					if(data.code === 0){
						_users.push(userInfo);
					}
					$rootScope.$broadcast( 'users.created', data.code);
				}
			);
		};
		var _saveUserChange = function(userid, legalname, username, password, role){
			var userInfo = {
				userId    : userid,
				userName  : username,
				legalName : legalname,
				role      : role
			};
			if(password){
				userInfo.password = md5.createHash(password);
			}
			$http.post('/authapi/users/update',
				{
					"userinfo" : userInfo
				}
			).success(function(data){
				if(data.code === 0){
					_users.every(function(user){
						if(user.userId === userInfo.userId){
							user.userName = userInfo.userName;
							user.legalName = userInfo.legalName;
							user.password =  userInfo.password;
							user.role = userInfo.role;
							return false;
						}
						return true;
					});
				}
				$rootScope.$broadcast( 'users.update', data.code);
			});
		};
		var _delUser = function(userid){
			$http.delete('/authapi/users/'+userid).success(function(data){
    			if(data.code === 0){
    				angular.forEach( _users, function(val,index){
    					if(val == cur){
    						_users.splice(index,1);						
    					}    				
    				})
    			}
    			$rootScope.$broadcast( 'users.delete', data.code);
    		});
		};
		var _userLogin = function(username, password){
			//_currentUser
		};
		return{
			getUsers : _getUsers,
			createNewUser : _createNewUser,
			saveUserChange : _saveUserChange,
			delUser : _delUser
		};
	}]);
});

