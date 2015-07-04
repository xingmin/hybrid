define(['./module', 'jquery','lodash'],function(performance, $,_){
    'use strict';
	performance.directive("createperformancedept", ['performanceService', '$modal',function(performanceService, $modal){
		return{
			restrict: 'AE',
			scope:{
			},
			controller: function($scope, $element, $attrs){
				var ModalInstanceCtrl = function ($scope, $modalInstance, $modal) {
					$scope.cancel = function () {
						$modalInstance.dismiss("cancel");
					};
					$scope.ok = function(){
						// you can pass anything you want value object or reference object
						$modalInstance.close($scope.deleteData);
					};
				};
				$scope.opts ={
					backdrop: 'static',
					templateUrl: "scripts/performance-review/createperformancedept.tpl.html",
					controller: ModalInstanceCtrl
				};
				$scope.openModal = function () {
					var modalInstance = $modal.open($scope.opts);
					modalInstance.result.then(function (data) {
						var deptId = $scope.deleteData.deptId;
						performanceService.delete(deptId).then(
							function(stat){
								$scope.$emit('performancedept-delete', {code: 0, message: "删除"+deptId+"成功"});
							},
							function(){
								$scope.$emit('performancedept-delete', {code: 1, message: "删除"+deptId+"失败"});
							}
						);

					}, function () {
						// function executed on modal dismissal
					});
				};

			},
			replace: false,
			link: function(scope, element, attrs){
				element.bind("click",function(){
					scope.openModal();
				});
			}
		}
	}]);
	performance.directive("delperformancedept", ['performanceService', '$modal',function(performanceService, $modal){
		return{
			restrict: 'AE',
			scope:{
				deleteData:"="
			},
			controller: function($scope, $element, $attrs){
				var ModalInstanceCtrl = function ($scope, $modalInstance, $modal) {
					$scope.cancel = function () {
						$modalInstance.dismiss("cancel");
					};
					$scope.ok = function(){
						// you can pass anything you want value object or reference object
						$modalInstance.close($scope.deleteData);
					};
				};
				var tmpscope =$rootScope.$new();
				tmpscope.deleteData = $scope.deleteData;
				$scope.opts ={
					backdrop: 'static',
					templateUrl: "scripts/performance-review/delperformancedept.tpl.html",
					controller: ModalInstanceCtrl,
					//windowClass: "app-modal-window",
					scope: tmpscope
				};
				$scope.openModal = function () {
					var modalInstance = $modal.open($scope.opts);
					modalInstance.result.then(function (data) {
                        var deptId = $scope.deleteData.deptId;
						performanceService.delete(deptId).then(
                            function(stat){
								$scope.$emit('performancedept-delete', {code: 0, message: "删除"+deptId+"成功"});
							},
							function(){
								$scope.$emit('performancedept-delete', {code: 1, message: "删除"+deptId+"失败"});
							}
                        );

					}, function () {
						// function executed on modal dismissal
					});
				};

			},
			replace: false,
			link: function(scope, element, attrs){
				element.bind("click",function(){
					scope.openModal();
				});
			}
		}
	}]);
});





