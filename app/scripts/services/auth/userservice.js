define(['../module'],function(services){
	'use strict';
	services.factory("userService",
			['$http', '$rootScope', 'md5',
			 function($http, $rootScope, md5){
		var _users = [];
		var _init = false;
        var _getUsersPromise = function(options){
            var params = {};
            if(options && options.py){ params.py = options.py;}
            if(options && options.empCode) { params.empCode = options.empCode;}
            return $http.get('/authapi/users/', {"params": params});
        };
		var _getUsers = function(options){
//			if(_init){
//				return _users;
//			}
            _getUsersPromise(options).success(function(data){
				if(data.code === 0){
                    //_users = data.value;
                    _users.splice(0, _users.length);
                    data.value.forEach(function(val){
						_users.splice(-1, 0, val);
                    });
				}
				$rootScope.$broadcast( 'users.refresh', data.code);
			});
//			_init = true;
			return _users;
		};
		
		var _createNewUser = function(legalname, username, password, role, empCode, legalNamePY){
			var userInfo = {
				userName  : username,
				legalName : legalname,
				password  : md5.createHash(password || ''),
				role      : role,
                empCode    : empCode,
                legalNamePY : legalNamePY
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
		var _saveUserChange = function(userid, legalname, username, password, role, empCode, legalNamePY){
			var userInfo = {
				userId    : userid,
				userName  : username,
				legalName : legalname,
				role      : role,
                empCode    : empCode,
                legalNamePY : legalNamePY
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
                            user.empCode = userInfo.empCode;
                            user.legalNamePY = userInfo.legalNamePY;
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
    			if(data.code !== 0){
                    $rootScope.$broadcast( 'users.delete', data.code);
					return;
				}
				angular.forEach( _users, function(val,index){
					if(val.userId == userid){
						_users.splice(index,1);
					}
				});
                $rootScope.$broadcast( 'users.delete', data.code);
    		});
		};
		return{
            getUsersPromise: _getUsersPromise,
			getUsers : _getUsers,
			createNewUser : _createNewUser,
			saveUserChange : _saveUserChange,
			delUser : _delUser
		};
	}]);
});

