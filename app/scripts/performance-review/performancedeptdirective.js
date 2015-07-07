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
					$scope.opTypeText = ($scope.opType === 'update'? "编辑": "新建");
					$scope.cancel = function () {
						$modalInstance.dismiss("cancel");
					};
					$scope.ok = function(){
						$scope.dept.deptId = $scope.dept.deptId || '';
						$scope.dept.deptName = $scope.dept.deptName || '';
						$scope.dept.pinYin = $scope.dept.pinYin || '';
						if($scope.dept.deptName === '') {
							return;
						}
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
					var tscope =$rootScope.$new();
					tscope.dept = $scope.dept;
					tscope.oaDept = $filter("oaDeptIdToDeptFilter")($scope.dept.OADeptId);
					tscope.opType = $attrs["opType"];
					$scope.opts.scope = tscope;
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
						performanceDeptService.createNew(data.dept.deptName, data.dept.pinYin, data.oaDept.id).then(
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





