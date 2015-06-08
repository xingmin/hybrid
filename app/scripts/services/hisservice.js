define(['./module', 'lodash'],function(services, _){
	'use strict';
	services.factory("hisService",['$http','$q',function($http, $q){
		var service = {};

		var _getBarCodeChargeInfoPromise = function(barcode){
			var params = {};
			params.barcode = barcode;
			return $http.get('/his/barcode/getchargeinfo', {params: params});
		};
		var _getBarCodeChargeInfo = function(barcode){
			var defered = $q.defer();
			_getBarCodeChargeInfoPromise(barcode)
				.success(function(data){
					var result = null;
					if(data.code === 0){
                        result = data.value;
					}
					defered.resolve(result);
				})
				.error(function(err){
					defered.reject(null);
				});
			return defered.promise;
		};

		service.getBarCodeChargeInfo = _getBarCodeChargeInfo;
		return service;
	}]);
});

