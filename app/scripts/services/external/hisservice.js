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
		var _getHisUserOfOpSupport = function(opt){
			var defered = $q.defer();
			var params = opt || {};
			if(opt.unit) params.unit = opt.unit;
			$http.get('/his/user/', {params: params}).success(function(data){
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
		var _getDeptsOfHis = function(){
			var defered = $q.defer();
			$http.get('/his/dept/').success(function(data){
				var result = null;
				if(data.code === 0){
					result = data.value;
				}
				defered.resolve(result);
			}).error(function(err){
				defered.reject(null);
			});
			return defered.promise;
		};
        var _arrDepts = null;
        var _getStaticDeptsOfHis = function(){
            var defered = $q.defer();
            if(_arrDepts !== null){
                defered.resolve(_arrDepts);
                return defered.promise;
            }
            _getDeptsOfHis().then(
                function(depts){
                    defered.resolve(depts);
                },
                function(){
                    defered.resolve([]);
                }
            )
            return defered.promise;
        };
		var _getBarCodeChargeInfoListPromise = function(qstart, qend, barCode, inpatientNo, times, pageNo, pageSize){
			var params = {};
			params.qstart = qstart;
			params.qend = qend;
			params.barcode = barCode;
			params.inpatientno = inpatientNo;
			params.times = times;
			params.pageno = pageNo;
			params.pagesize = pageSize;
			return $http.get('/his/barcode/', {params: params});
		};
		var _getBarCodeChargeInfoList = function(qstart, qend, barCode, inpatientNo, times, pageNo, pageSize){
			var defered = $q.defer();
			_getBarCodeChargeInfoListPromise(qstart, qend, barCode, inpatientNo, times, pageNo, pageSize)
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
		var _getBarCodeListCountPromise = function(qstart, qend, barCode, inpatientNo, times){
			var params = {};
			params.qstart = qstart;
			params.qend = qend;
			params.barcode = barCode;
			params.inpatientno = inpatientNo;
			params.times = times;
			return $http.get('/his/barcode/count', {params: params});
		};
		var _getBarCodeListCount = function(qstart, qend, barCode, inpatientNo, times){
			var defered = $q.defer();
            _getBarCodeListCountPromise(qstart, qend, barCode, inpatientNo, times)
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
		service.convertBarCodeInfoToHtml = _convertBarCodeInfoToHtml;
		service.getHisUserOfOpSupport = _getHisUserOfOpSupport;
		service.getBarCodeChargeInfoList = _getBarCodeChargeInfoList;
		service.getBarCodeChargeInfoListCount = _getBarCodeListCount;
		service.getDeptsOfHis = _getDeptsOfHis;
        service.getStaticDeptsOfHis = _getStaticDeptsOfHis;
		return service;
	}]);
});

