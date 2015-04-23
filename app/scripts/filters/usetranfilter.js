define(['./module'],function(filters){
    'use strict';	
    filters.filter("useTranFilter",
    		[function(){
    	return function(inputval){
    		if(!inputval || inputval === 0){
    			return '未用'
    		}else if(inputval === 1){
    			return '已用';
    		}else{
    			return '';
    		}
    	};
	}]);
})





