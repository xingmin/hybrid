define(['./module', 'lodash'],function(filters, _){
    'use strict';	
    filters.filter("oproomsPinyinFilter",[function(){
         return function(oprooms, inputval){
            var result =[];
            var regex = new RegExp("^"+inputval, "i");
            if(_.isEmpty(inputval)){
                return result;
            }
            return _.filter(oprooms, function(oproom) {
                return regex.test(oproom.name);
            });
        };
    }]);
    filters.filter("oproomsNameFilter",['oproomService',function(oproomService){
        var _allOpRooms = [];
        oproomService.getAllOpRooms().then(
            function(oprooms){
                _allOpRooms = oprooms;
            }
        );
        return function(name){
            return _.find(_allOpRooms, function(oproom) {
                return oproom.name === name;
            });
        };
    }]);
})





