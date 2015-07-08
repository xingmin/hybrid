define(['angular', 'bootstrap', 'angular-bootstrap', "angular-ui-select"], function(angular) {
    'use strict';
    var oa = angular.module('oa', [ 'ui.select']);
    oa.factory("oaService",['$http','$q',function($http, $q){
        var service = {};
        var _arrEmps = null;
        var _getStaticEmpsOfOA = function(){
            var defered = $q.defer();
            if(_arrEmps !== null){
                defered.resolve(_arrEmps);
                return defered.promise;
            }
            $http.get('/oa/emp/').success(
                function(data){
                    if(data.code === 0){
                        _arrEmps = data.value;
                    }else{
                        _arrEmps = [];
                    }
                    defered.resolve(_arrEmps);
                }
            ).error(
                function(){
                    _arrEmps = [];
                    defered.resolve([]);
                }
            );
            return defered.promise;
        };
        _getStaticEmpsOfOA();
        service.getStaticEmpsOfOA = _getStaticEmpsOfOA;
        return service;
    }]);
    oa.filter("oaEmpPinyinFilter",[function(){
        return function(emps, inputval){
            var result =[];
            var regex = new RegExp("^"+inputval, "i");
            if(_.isEmpty(inputval)){
                //return result;
                return emps;
            }
            return _.filter(emps, function(emp) {
                return regex.test(emp.py);
            });
        };
    }]);
    oa.filter("oaEmpIdToNameFilter",['oaService', function(oaService){
        //var arrDepts = null;
        //oaService.getStaticDeptsOfOA().then(
        //    function(depts){
        //        arrDepts = depts;
        //    }
        //);
        return function(id, arrEmps){
            return _.result(_.find(arrEmps, {id:id}), "name");
        };
    }]);
    oa.filter("oaEmpIdToDeptFilter",['oaService', function(oaService){
        //var arrDepts = null;
        //oaService.getStaticDeptsOfOA().then(
        //    function(depts){
        //        arrDepts = depts;
        //    }
        //);
        return function(id, arrEmps ){
            return _.find(arrEmps, {id:id});
        };
    }]);
    oa.directive("oaEmpSelect",['oaService', function(oaService){
        return{
            restrict : 'E',
            require : 'ngModel',
            scope: {
                ngModel : '='
            },
            controller: function($scope, $element, $attrs){
                $scope.emps = null;
                oaService.getStaticEmpsOfOA().then(
                    function(emps){
                        $scope.emps = emps;
                    }
                );
            },
            template:
            "<ui-select"
            +" ng-model=\"$parent.ngModel\""
            +" theme=\"bootstrap\""
            +" ng-disabled=\"disabled\""
            +" reset-search-input=\"false\""
            +" title=\"选择姓名\">"
            +"<ui-select-match placeholder=\"选择姓名\">{{$select.selected.name}}</ui-select-match>"
            +"<ui-select-choices repeat=\"emp in emps | oaEmpPinyinFilter:$select.search track by $index\""
            +" refresh-delay=\"0\">"
            +"<div ng-bind=\"emp.name\"></div>"
            +"</ui-select-choices>"
            +"</ui-select>",
            link:function(scope, element, attrs){
            }
        }
    }])

    return oa;
});