define(['./module', 'lodash'],function(filters, _){
    'use strict';	
    filters.filter("userFilter",['userService', function(userService){
		var _allUser = [];
        userService.getUsersPromise().success(
            function(data){
                if(data.code !== 0 ) return;
                _allUser = data.value;
            }
        );
    	return function(inputval){
            return _.result(_.find(_allUser, function(user) {
                return user.empCode === inputval;
            }), 'legalName');
    	};
	}]);
})





