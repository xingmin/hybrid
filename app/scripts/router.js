define(["./appx"],
	function(app){
		return app
			.config(['$routeProvider', '$locationProvider',
			    function($routeProvider, $locationProvider){
					$routeProvider
					.when('/',{
						templateUrl:'/views/tpl/welcome.html'
					})
					.when('/opsupport/draw',{
						templateUrl:'/views/tpl/draw.html',
						controller: 'drawController'
					})
					.when('/auth/user',{
						templateUrl:'/views/tpl/auth/user.html',
						controller: 'userController'
					})
					.when('/auth/permission',{
						templateUrl:'/views/tpl/auth/permission.html',
						controller: 'permissionController'
					})
					.when('/auth/role',{
						templateUrl:'/views/tpl/auth/role.html',
						controller: 'roleController'
					})
					.when('/auth/grant',{
						templateUrl:'/views/tpl/auth/grant.html',
						controller: 'grantController'
					})
					.when('/auth/login',{
						templateUrl:'/views/tpl/auth/login.html',
						controller: 'userLoginController'
					})
					.otherwise({
						redirectTo:'/'
					});
					//$locationProvider.html5Mode(true);//以后再研究2
				}
		]);
	}
);
