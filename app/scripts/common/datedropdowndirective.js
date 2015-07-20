define(['angular'],function(angular){
    'use strict';
	var cdate = angular.module("common.date",[]);
	cdate.directive("yearDropdown", [function(){
		return{
			restrict: 'E',
			require: '?^ngModel',
			scope:{
				yearRangeMin:"@",//create or update
				yearRangeMax:"@",
				ngModel:"="
			},
			controller: function($scope, $element, $attrs){
				$scope.years = [];
				for(var i=$scope.yearRangeMin;i<=$scope.yearRangeMax;i++){
					$scope.years.push(i);
				}
			},
			replace: false,
			template:"<select  ng-model=\"ngModel\" ng-options=\"y for y in years\"></select>",
			link: function(scope, element, attrs){
			}
		}
	}]);
	cdate.directive("monthDropdown", [function(){
		return{
			restrict: 'E',
			require: '?^ngModel',
			scope:{
				ngModel:"="
			},
			controller: function($scope, $element, $attrs){
				$scope.months = [];
				for(var i=1;i<=12;i++){
					$scope.months.push(i);
				}
			},
			replace: false,
			template:"<select  ng-model=\"$parent.ngModel\" ng-options=\"m for m in months\"></select>",
			link: function(scope, element, attrs){
			}
		}
	}]);
});





