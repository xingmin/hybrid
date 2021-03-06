define(['./module'],function(services){
	'use strict';
	services.factory("AccessEntryService",
			['$http', '$rootScope', 'md5','$timeout','AuthService',
			 function($http, $rootScope, md5, $timeout, AuthService){
		var service = {};
		var _accessEntry = 
		{
			"home":{
				accessname: 'Home',
				url: '/',
				enable: false
			},
			"opsupport": {
	        	accessname: '手术支持',
	        	enable: false,	
				'draw': {
					accessname: '领用',
					perm: {resource:'opsupport', action: 'access-entry'},
					url: '/opsupport/draw',
					enable: false
				},
				'recycle': {
					accessname: '回收',
					perm: {resource:'opsupport', action: 'recycle'},
					url: '/opsupport/recycle',
					enable: false
				},
				'barcodeaudit': {
					accessname: '条码审核',
					perm: {resource:'opsupport', action: 'barcode-audit'},
					url: '/opsupport/barcodeaudit',
					enable: false
				},
				'syncuser': {
					accessname: '同步账户',
					perm: {resource:'opsupport', action: 'syncuser'},
					url: '/opsupport/syncuser',
					enable: false
				},
				'oproom': {
					accessname: '手术室定义',
					perm: {resource:'oproom', action: 'access-entry'},
					url: '/opsupport/oproom',
					enable: false
				}
           },
           "auth": {
        	   accessname: '权限管理',
        	   enable: false,
    		   "user": {
            	   accessname: '用户',
            	   perm: {resource:'user', action: 'access-entry'},
            	   url: '/auth/user',
            	   enable: false
               },
              "role": {
            	   accessname: '角色',
            	   perm: {resource:'role', action: 'access-entry'},
            	   url: '/auth/role',
            	   enable: false
               },
               "permission": {
            	   accessname: '权限',
            	   perm: {resource:'permission', action: 'access-entry'},
            	   url: '/auth/permission',
            	   enable: false
               },
               "grant": {
            	   accessname: '授权',
            	   perm: {resource:'role', action: 'access-entry'},
            	   url: '/auth/grant',
            	   enable: false
               }
           },
			//"performance":{
			//	accessname: '绩效考核',
			//	enable: true,
			//	"uploadPerformance": {
			//		accessname: '上传绩效数据',
			//		perm: {resource:'performance', action: 'upload'},
			//		url: '/performance/uploadperformance',
			//		enable: true
			//	},
			//	"performanceDept": {
			//		accessname: '部门对应',
			//		perm: {resource:'performance', action: 'dept'},
			//		url: '/performance/performancedept',
			//		enable: true
			//	}
			//}
		};
		var _changeParentStatus = function(parent){
			parent.enable = false;
			for(var i in parent){
				if(parent[i] && typeof(parent[i]) === 'object' && parent[i].enable){
					parent.enable = true;
					return;
				}
			}
		};
		var _traverse=function(obj, cb){
			for(var i in obj){
				if(obj[i] && typeof(obj[i]) === 'object' ){
					cb(obj[i], obj);
					//arguments.callee(obj[i], cb);
					_traverse(obj[i], cb);
				}
			}
		};
		var _checkPerm = function(entry, parent){
			if(entry && entry.perm){
				AuthService.checkPermission(entry.perm.action, entry.perm.resource)
					.success(function(resp){
						entry.enable = (resp.code === 0);
						_changeParentStatus(parent);
					});
			}
		};
		 var _refreshAccessEntry=function(){
			 _traverse(_accessEntry, _checkPerm);
		 };
		service.refreshAccessEntry = _refreshAccessEntry;
		service.accessEntry = _accessEntry;
		return service;
	}]);
});

