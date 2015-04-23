define(['./module'],function(filters){
    'use strict';	
    filters.filter("formatDateFilter",
    		['moment', function(moment){
    	return function(inputdate, strFormat){
    		if(!strFormat) strFormat = 'YYYY-MM-DD HH:mm:ss';
    		if(inputdate){
    			return moment(inputdate).format(strFormat);
    		}else{
    			return '';
    		}
    	};
	}]);
})





