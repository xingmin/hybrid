define(['angular'],function(angular){
    'use strict';
	var cdate = angular.module("common.date",[]);
	cdate.controller("yearDropDownCtrl",function($scope, $element, $attrs){
		var self = this;
		$scope.years = [];
		for(var i=$scope.yearRangeMin;i<=$scope.yearRangeMax;i++){
			$scope.years.push(i);
		}
	});
	cdate.directive("yearDropdown", [function(){
		return{
			restrict: 'E',
			require: '^ngModel',
			scope:{
				yearRangeMin:"@",//create or update
				yearRangeMax:"@",
				selected:"=ngModel"
			},
			controller: "yearDropDownCtrl",
			replace: false,
			template:"<ul class='list-inline'><li><select class=\"form-control\"  ng-model=\"selected\" ng-options=\"y for y in years\"></select></li><li>年</li></ul>",
			link: function(scope, element, attrs){
			}
		}
	}]);
	cdate.directive("monthDropdown", [function(){
		return{
			restrict: 'E',
			require: '^ngModel',
			scope:{
				selected:"=ngModel"
			},
			controller: function($scope, $element, $attrs){
				$scope.months = [];
				for(var i=1;i<=12;i++){
					$scope.months.push(i);
				}
			},
			replace: false,
			template:"<ul class='list-inline'><li><select class=\"form-control\" ng-model=\"selected\" ng-options=\"m for m in months\"></select></li><li><label >月</label></li></ul>",
			link: function(scope, element, attrs){
			}
		}
	}]);
	cdate.controller("yearMonthDropDownControl",function($scope, $element, $attrs){
		$scope.selected = {};
	});
	cdate.directive("yearMonthDropdown", [function(){
		return{
			restrict: 'E',
			require: '^ngModel',
			scope:{
				yearRangeMin:"@",//create or update
				yearRangeMax:"@",
				selected:"=ngModel"
			},
			controller: "yearMonthDropDownControl",
			replace: false,
			template:"<ul class='list-inline'><li><year-dropdown  year-range-min=\"{{yearRangeMin}}\" year-range-max=\"{{yearRangeMax}}\" ng-model=\"selected.year\"></year-dropdown></li><li><month-dropdown ng-model=\"selected.month\"></month-dropdown></li></ul>",
			link: function(scope, element, attrs){
			}
		}
	}]);
});





