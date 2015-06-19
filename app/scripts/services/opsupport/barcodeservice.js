define(['../module', 'lodash'],function(services, _){
	'use strict';
	services.factory("barCodeService",['$http', '$q',function($http, $q){
		var service = {};
		var _getBarCodeStatus = function(barcode){
			var defered =$q.defer();
			$http.get('/barcode/'+barcode+'/status').success(
				function(resp){
					if(resp.code === 0){
						defered.resolve(resp.value);
						return;
					}
					defered.reject(new Error("获取条形码状态失败!"));
				}
			).error(
				function(err){
					defered.reject(err);
				}
			);
			return defered.promise;
		};
		var statObj = {
			"1": "无记录",
			"2": "分发",
			"3": "回收/已用",
			"4": "回收/未用"
		};
		var _convertStatusToHumanReadable = function(status){
			return statObj[status];
		};
		service.getBarCodeStatus = _getBarCodeStatus;
		service.convertStatusToHumanReadable = _convertStatusToHumanReadable;
		return service;
	}]);
});

