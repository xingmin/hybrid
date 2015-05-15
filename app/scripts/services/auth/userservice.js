define(['../module', 'moment'],function(services, moment){
	'use strict';
	services.factory("userService",
			['$http', '$rootScope', 'md5','$timeout',
			 function($http, $rootScope, md5, $timeout){
		var _users = [];
		var _init = false;
		var _authToke = {};
		
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
		var _reorgnizeAuthToken = function(data){
			_authToke = _authToke || {};
			_authToke.access_token  = data.access_token;
			_authToke.expires_in    = data.expires_in;
			_authToke.refresh_token = data.refresh_token;
			_authToke.token_type    = data.token_type;
			
		};
		var _userLogin = function(username, password){
			$http.post('/authapi/oauth/token',
					{
						'client_id'     : 'android',
						'client_secret' : 'SomeRandomCharsAndNumbers',
						'username'      : username,
						'password'      : md5.createHash(password || ''),
						'grant_type'    : 'password'
					}
				)
				.then(
					function(recv){
						var data = recv.data;
						_reorgnizeAuthToken(data);
						//开始计时刷新accessToken
						var interval =(Number(_authToke.expires_in)-Number(_authToke.expires_in)*0.1)*1000;
						$timeout(function(){_refreshToken(interval);},interval);
						$rootScope.$broadcast( 'users.login', true);
					},
					function(err){
						$rootScope.$broadcast( 'users.login', false);
					}
				);
		};
		var _refreshToken = function(interval){
			$timeout(function(){_refreshToken(interval);},interval);
			if ( !_authToke.refresh_token){
				return;
			}
			console.log(moment().format('YYYY-MM-DD HH:mm:ss')+'refresh token');
			$http.post('/authapi/oauth/token',
					{
						'client_id'     : 'android',
						'client_secret' : 'SomeRandomCharsAndNumbers',
						'refresh_token' : _authToke.refresh_token,
						'grant_type'    : 'refresh_token'
					}
				)
				.then(
					function(recv){
						var data = recv.data;
						_reorgnizeAuthToken(data);
						//$rootScope.$broadcast( 'users.refreshtoken', true);
					},
					function(err){
						//$rootScope.$broadcast( 'users.refreshtoken', false);
					}
				);			
		};
		return{
			refreshToken:_refreshToken,
			userLogin: _userLogin,
			getUsers : _getUsers,
			createNewUser : _createNewUser,
			saveUserChange : _saveUserChange,
			delUser : _delUser
		};
	}]);
});

