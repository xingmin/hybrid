define(['./module', 'jquery'],function(directives, $){
    'use strict';
    directives.directive("deptselect",['hisService', function(hisService){
        return{
            restrict : 'E',
            scope: {
                selectedItem : '='
            },
            controller: function($scope, $element, $attrs){
                $scope.depts = null;
                hisService.getStaticDeptsOfHis().then(
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
                        +"<ui-select-choices repeat=\"dept in depts | deptPinyinFilter:$select.search track by $index\""
                            +" refresh-delay=\"0\">"
                        +"<div ng-bind=\"dept.name\"></div>"
                    +"</ui-select-choices>"
                 +"</ui-select>",
            link:function(scope, element, attrs){
            }
        }
	}])
})





