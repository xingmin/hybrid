define(["./appx"],
	function(app){
		return app
			.config(['$routeProvider', '$locationProvider',
			    function($routeProvider, $locationProvider){
					$routeProvider
					.when('/',{
						templateUrl:'/views/tpl/welcome.html'
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
                    .when('/opsupport/draw',{
                        templateUrl:'/views/tpl/opsupport/draw.html',
                        controller: 'drawController'
                    })
					.when('/opsupport/recycle',{
						templateUrl:'/views/tpl/opsupport/recycle.html',
						controller: 'recycleController'
					})
					.when('/opsupport/barcodeaudit',{
						templateUrl:'/views/tpl/opsupport/barcodeaudit.html',
						controller: 'barCodeAuditCtrl'
					})
					.when('/opsupport/syncuser',{
						templateUrl:'/views/tpl/opsupport/syncuser.html',
						controller: 'syncUserCtrl'
					})
					.when('/opsupport/oproom',{
							templateUrl:'/views/tpl/opsupport/oproom.html',
							controller: 'oproomController'
					})
					.when('/performance/uploadperformance',{
						templateUrl:'/scripts/performance-review/performance.html',
						controller: 'performanceCtrl'
					})
					.when('/performance/performancedept',{
						templateUrl:'/scripts/performance-review/performancedept.html',
						controller: 'performanceDeptCtrl'
					})
					.otherwise({
						redirectTo:'/'
					});
					//$locationProvider.html5Mode(true);//以后再研究2
				}
		]);
	}
);
