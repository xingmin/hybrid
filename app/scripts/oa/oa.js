define(['angular', 'bootstrap', 'angular-bootstrap', "angular-ui-select"], function(angular) {
    'use strict';
    var oa = angular.module('oa', [ 'ui.select']);
    oa.factory("oaService",['$http','$q',function($http, $q){
        var service = {};
        var _arrDepts = null;
        var _getStaticDeptsOfOA = function(){
            var defered = $q.defer();
            if(_arrDepts !== null){
                defered.resolve(_arrDepts);
                return defered.promise;
            }
            $http.get('/oa/dept').success(
                function(depts){
                    _arrDepts = depts;
                    defered.resolve(depts);
                }
            ).error(
                function(){
                    _arrDepts = [];
                    defered.resolve([]);
                }
            );
            return defered.promise;
        };
        service.getStaticDeptsOfOA = _getStaticDeptsOfOA;
        return service;
    }]);
    oa.filter("oaDeptPinyinFilter",[function(){
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
    oa.filter("oaDeptIdToNameFilter",[function(){
        return function(depts, id){
            return _.result(_.find(depts, {id:id}), "name");
        };
    }]);
    oa.filter("oaDeptIdToDeptFilter",[function(){
        return function(depts, id){
            return _.find(depts, {id:id});
        };
    }]);
    oa.directive("oaDeptSelect",['oaService', function(oaService){
        return{
            restrict : 'E',
            scope: {
                selectedItem : '='
            },
            controller: function($scope, $element, $attrs){
                $scope.depts = null;
                oaService.getStaticDeptsOfOA().then(
                    function(depts){
                        $scope.depts = depts;
                    }
                );
            },
            template:
            "<ui-select ng-model=\"$parent.selectedItem\""
            +" theme=\"bootstrap\""
            +" ng-disabled=\"disabled\""
            +" reset-search-input=\"true\""
            +" title=\"选择科室\">"
            +"<ui-select-match placeholder=\"选择科室\">{{$select.selected.name}}</ui-select-match>"
            +"<ui-select-choices repeat=\"dept in depts | oaDeptPinyinFilter:$select.search track by $index\""
            +" refresh-delay=\"0\">"
            +"<div ng-bind=\"dept.name\"></div>"
            +"</ui-select-choices>"
            +"</ui-select>",
            link:function(scope, element, attrs){
            }
        }
    }])

    return oa;
});