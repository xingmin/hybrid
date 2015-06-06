define(['./module', 'lodash'],function(filters, _){
    'use strict';	
    filters.filter("userFilter",['userService', function(userService){
        var _allUser = [];
        userService.getAllUsersQ().then(
            function(users){
                _allUser = users;
            }
        );

    	return function(inputval){
            return _.result(_.find(_allUser, function(user) {
                return user.empCode === inputval;
            }), 'legalName');
    	};
	}]);
    filters.filter("userPinyinFilter",['userService', function(userService){
         return function(users, inputval){
            var result =[];
            var regex = new RegExp("^"+inputval, "i");
            if(_.isEmpty(inputval)){
                return result;
            }
            return _.filter(users, function(user) {
                return regex.test(user.legalNamePY);
            });
        };
    }]);
    filters.filter("userEmpCodeFilter",['userService', function(userService){
        var _allUser = [];
        userService.getAllUsersQ().then(
            function(users){
                _allUser = users;
            }
        );
        return function(empCode){
            return _.find(_allUser, function(user) {
                return user.empCode === empCode;
            });
        };
    }]);
})





