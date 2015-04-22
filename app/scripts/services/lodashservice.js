define(['./module', 'lodash'],function(services, lodash){
    'use strict';
	services.factory("lodashService",[function(){
		return lodash;
	}]);
});

