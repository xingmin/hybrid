define(['./module'],function(filters){
    'use strict';	
    filters.filter("translateMode",[function(){
    	return function(mode, translateFunc){
		  return translateFunc(mode);
    	}
	}])
})





