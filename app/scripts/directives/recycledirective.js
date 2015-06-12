define(['./module', 'jquery','lodash'],function(directives, $,_){
    'use strict';	
    directives.directive("recycle", ['userService', 'recycleService', 'AuthValue', 'hisService', '$modal',function(userService, recycleService, AuthValue, hisService, $modal){
		return{
			restrict: 'AE',
			scope: {
			},

			controller: function($scope, $element, $attrs){
				var ModalInstanceCtrl = function ($scope, $modalInstance) {
					$scope.$on('recycles.create', function(data){
						$modalInstance.close('创建成功');
					});
					$scope.cancel = function () {
						$modalInstance.dismiss("cancel");
					};
					$scope.ok = function(){
						$scope.saveRecycle();
						// you can pass anything you want value object or reference object
						//$modalInstance.close($scope.deleteData);
					};
					$scope.allUsers = null;
					userService.getAllUsersQ().then(
						function(users){
							$scope.allUsers = users;
						}
					);
					$scope.barcodeCollecter = '';
					$scope.initRecycleModal = function(){
						$scope.recycler.selected = AuthValue.currentUser;
						$scope.barcodeCollecter='';
						$scope.recycleDetails=[];
					};
					$scope.recycler = {};
					$scope.returner = {};
					$scope.initRecycleModal();
					$scope.collectBarcode = function(event, barcode){
						if(event.which === 13){
							if( !angular.isArray($scope.recycleDetails)){
								$scope.recycleDetails=[];
							}
							if(_.find($scope.recycleDetails, {barcode: barcode})){
								event.preventDefault();
								return;
							}
							$scope.recycleDetails.push({'barcode':barcode, 'useFlag':0});
							hisService.getBarCodeChargeInfo(barcode).then(
								function(chargeInfo){
									if(!chargeInfo) return;
									var detail = _.find($scope.recycleDetails, {barcode: barcode});
									if(detail) {
										detail.chargeInfo = chargeInfo;
										detail.useFlag = 1;
										detail.chargeHtml = hisService.convertBarCodeInfoToHtml(chargeInfo);
									}
								}
							);
							$scope.barcodeCollecter = '';
							event.preventDefault();
						}
					};
					$scope.deleteBarcode = function(arrRecycleDetail, detail){
						arrRecycleDetail
						&& arrRecycleDetail.length>0
						&& arrRecycleDetail.splice(arrRecycleDetail.indexOf(detail),1);
					};
					$scope.saveRecycle = function(){
						recycleService.createNewRecycle(
							($scope.returner.selected? ($scope.returner.selected.empCode || '') : ""),
							($scope.selected? ($scope.selected.empCode || '') : ""),
							$scope.remark,
							$scope.recycleDetails,
							$scope.draws
						);
					};
				};
				$scope.opts ={
					backdrop: 'static',
					templateUrl: 'views/component/recycle.tpl.html',
					controller: ModalInstanceCtrl
					//windowClass: "app-modal-window",
				};
				$scope.openModal = function () {
					var modalInstance = $modal.open($scope.opts);
					modalInstance.result.then(function (data) {

					}, function () {
						// function executed on modal dismissal
					});
				};

			},
			replace: true,
			link: function(scope, element, attrs){
				element.bind("click",function(){
					scope.openModal();
				});
			}
		}
	}]);

	directives.directive("delrecycle", ['recycleService', '$modal',function(recycleService, $modal){
		return{
			restrict: 'AE',
			scope:{
				deleteData:"="
			},
			controller: function($scope, $element, $attrs){
				var ModalInstanceCtrl = function ($scope, $modalInstance, $modal, deleteData) {
					//$scope.productSelected = function (productID) {
					//	$modalInstance.close(productID);
					//};
					$scope.deleteData = deleteData;

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
					templateUrl: "views/component/delrecycle.tpl.html",
					controller: ModalInstanceCtrl,
					//windowClass: "app-modal-window",
					resolve: {}
				};
				$scope.opts.resolve.deleteData = function(){
					return $scope.deleteData;
				};
				$scope.openModal = function () {
					var modalInstance = $modal.open($scope.opts);
					modalInstance.result.then(function (data) {
                        var recycleId = $scope.deleteData.id;
                        recycleService.deleteRecycle(recycleId).then(
                            function(stat){
								$scope.$emit('recycle-delete', {code: 0, message: "删除"+recycleId+"成功"});
							},
							function(){
								$scope.$emit('recycle-delete', {code: 1, message: "删除"+recycleId+"失败"});
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





