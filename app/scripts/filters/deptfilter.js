define(['./module', 'lodash'],function(filters, _){
    'use strict';	
    filters.filter("deptPinyinFilter",[function(){
         return function(depts, inputval){
            var result =[];
            var regex = new RegExp("^"+inputval, "i");
            if(_.isEmpty(inputval)){
                //return result;
                return depts;
            }
            return _.filter(depts, function(dept) {
                return regex.test(dept.py);
            });
        };
    }]);
})





