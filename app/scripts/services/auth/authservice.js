define(['../module', 'moment'],function(services, moment){
	'use strict';
	services.factory("AuthService",
			['$http', '$rootScope', 'md5','$timeout','AuthValue','userService',
			 function($http, $rootScope, md5, $timeout, AuthValue, userService){
		var _authToken = {};
		var _updateAuthToken = function(data){
			_authToken = _authToken || {};
			data = data || {};
			_authToken.access_token  = data.access_token || '';
			_authToken.expires_in    = data.expires_in || '';
			_authToken.refresh_token = data.refresh_token || '';
			_authToken.token_type    = data.token_type || '';
			AuthValue.authToken = _authToken;
			//如果从服务端刷新token失败，则重新置为未登录状态。
			AuthValue.isLogin = data ? true : false;
            _getUserByToken();
		};
		var _checkPermission = function(action, resource){
			var params = {
                action: action,
                resource: resource
			};
			return $http.get('/authapi/users/checkperm', {params: params});
		};
		var _requestAccessToken = function(username, password){
			$http.post('/authapi/oauth/token',
					{
						'client_id'     : 'android',
						'client_secret' : 'SomeRandomCharsAndNumbers',
						'username'      : username,
						'password'      : md5.createHash(password || ''),
						'grant_type'    : 'password'
					}
				).then(
					function(recv){
						var data = recv.data;
						if(recv.status !== 200){
							$rootScope.$broadcast( 'users.login', false);
							return;
						}
						_updateAuthToken(data);
						//开始计时刷新accessToken
						var interval =(Number(_authToken.expires_in)-Number(_authToken.expires_in)*0.1)*1000;
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
			if ( !_authToken.refresh_token){
				return;
			}
			console.log(moment().format('YYYY-MM-DD HH:mm:ss')+'refresh token');
			$http.post('/authapi/oauth/token',
					{
						'client_id'     : 'android',
						'client_secret' : 'SomeRandomCharsAndNumbers',
						'refresh_token' : _authToken.refresh_token,
						'grant_type'    : 'refresh_token'
					}
				)
				.then(
					function(recv){
						var data = recv.data;
						_updateAuthToken(data);
					},
					function(err){
						_updateAuthToken(null);
					}
				);
		};
		var _getAccessToken = function(){
			return _authToken.access_token || '';
		};
		var _destroyAuthToken = function(){
			_updateAuthToken(null);
		};
		var _logout = function(){
			_destroyAuthToken();
			$rootScope.$broadcast( 'users.logout', true);
		};
		var _isLogin = function(){
			return AuthValue.isLogin;
		};
        var _getUserByToken = function(){
            if( !AuthValue.isLogin ){
                AuthValue.currentUser = {};
                return;
            }
            //token是在authinterceptor中加入header中的
            $http.get('/authapi/users/getuserbytoken').success(function(data){
                var user = {};
                if(data.code === 0) user = data.value;
                AuthValue.currentUser = user;
            });
        };
		return{
			destroyAuthToken   :   _destroyAuthToken,
			getAccessToken     :   _getAccessToken,
			requestAccessToken :   _requestAccessToken,
			refreshToken       :   _refreshToken,
			logout             :   _logout,
			isLogin            :   _isLogin,
			checkPermission    :   _checkPermission
		};
	}]);
});

