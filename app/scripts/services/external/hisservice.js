define(['../module', 'lodash', 'moment'],function(services, _, moment){
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
		var _convertBarCodeInfoToHtml = function(chargeInfo){
			if (!chargeInfo) return null;
			return "<ul class='list-unstyled text-left'>"+
				"<li>ID:"+chargeInfo.inpatientNo+"</li>"+
				"<li>姓名:"+chargeInfo.name+"</li>"+
				"<li>价格:"+chargeInfo.chargePrice+"</li>"+
				"<li>日期:"+ moment(chargeInfo.inputDate).format('YYYY-MM-DD HH:mm')+"</li>"+
				"</ul>"
		};
		var _getHisUserOfOpSupport = function(){
			var defered = $q.defer();
			$http.get('/his/user/').success(function(data){
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
		service.convertBarCodeInfoToHtml = _convertBarCodeInfoToHtml;
		service.getHisUserOfOpSupport = _getHisUserOfOpSupport;
		return service;
	}]);
});

