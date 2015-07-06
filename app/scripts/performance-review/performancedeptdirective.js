define(['./module', 'lodash', './performancedeptservice'],function(performance, _){
    'use strict';
	performance.directive("cuPerformanceDept", ['performanceDeptService', '$modal', '$filter','$rootScope',function(performanceDeptService, $modal, $filter, $rootScope){
		return{
			restrict: 'AE',
			scope:{
				opType:"@",//create or update
				dept:"="
			},
			controller: function($scope, $element, $attrs){
				var ModalInstanceCtrl = function ($scope, $modalInstance, $modal) {
					$scope.dept= $scope.dept || {};
					$scope.oaDept= $scope.oaDept || {};
					$scope.cancel = function () {
						$modalInstance.dismiss("cancel");
					};
					$scope.ok = function(){
						// you can pass anything you want value object or reference object
						$modalInstance.close({dept:$scope.dept, oaDept:$scope.oaDept} );
					};
				};
				$scope.opts ={
					backdrop: 'static',
					templateUrl: "scripts/performance-review/createperformancedept.tpl.html",
					controller: ModalInstanceCtrl
				};
				if($attrs["opType"] === "update"){
					$scope.opts.scope =$rootScope.$new();
					$scope.opts.scope.dept = $scope.dept;
					$scope.opts.scope.oaDept = $filter("oaDeptIdToDeptFilter")($scope.dept.OADeptId);
//					$scope.opts.scope.opType = $attrs["opType"];
				}
				$scope.openModal = function () {
					var modalInstance = $modal.open($scope.opts);
					modalInstance.result.then(function (data) {
						if($attrs["opType"] === "update"){
							performanceDeptService.update(data.dept.deptId, data.dept.deptName, data.dept.pinYin, data.oaDept.id).then(
								function(){
									$scope.$emit('performanceDept-update', {code: 0, message: "修改"+dept.deptId+"成功"});
								},
								function(){
									$scope.$emit('performanceDept-update', {code: 0, message: "修改"+dept.deptId+"失败"});
								}
							);
							return;
						}
						performanceDeptService.createNew(dept.deptName, dept.pinYin, dept.oaDept).then(
							function(stat){
								$scope.$emit('performanceDept-create', {code: 0, message: "新建"+dept.deptName+"成功"});
							},
							function(){
								$scope.$emit('performanceDept-create', {code: 1, message: "新建"+dept.deptName+"失败"});
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
	performance.directive("delPerformanceDept", ['$rootScope', 'performanceDeptService', '$modal',function($rootScope, performanceDeptService, $modal){
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
						performanceDeptService.delete(deptId).then(
                            function(stat){
								$scope.$emit('performanceDept-delete', {code: 0, message: "删除"+deptId+"成功"});
							},
							function(){
								$scope.$emit('performanceDept-delete', {code: 1, message: "删除"+deptId+"失败"});
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





