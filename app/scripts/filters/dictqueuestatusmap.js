define(['./module'],function(filters){
    'use strict';	
    filters.filter("dictQueueStatusMap",[function(){
    	return function(id, dictQueueStatus){
    		var statusName='';
    		dictQueueStatus.every(function(status){
    			if(status.statusId === id){
    				statusName = status.statusName;
    				return false;
    			}
    			return true;
    		});
    		return statusName;
    	};
	}]);
})





