define(['./module', 'jquery','lodash'],function(directives, $,_){
    'use strict';	
    directives.directive("recycle", ['userService', 'recycleService', 'AuthValue', 'hisService',function(userService, recycleService, AuthValue, hisService){
		return{
			restrict: 'AE',
			scope: {
                "draws":"="
            },
			templateUrl: 'views/component/recycle.tpl.html',
			controller: function($scope, $element, $attrs){
				$scope.allUsers = null;
				userService.getAllUsers().then(
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
				$scope.$on('recycles.create', function(evt, data){
					if(data && data.status){
						$element.children[0].modal('hide');
					}
				});
			},
			replace: true,
			link: function(scope, element, attrs){
				element.bind("click",function(){
					$(element).modal('show');
				});
			}
		}
	}]);

	directives.directive("delrecycle", ['recycleService', function(recycleService){
		return{
			restrict: 'AE',
			require: 'ngModel',
			controller: function($scope, $element, $attrs){
                var ModalInstanceCtrl = function ($scope, $modalInstance) {
                    //$scope.productSelected = function (productID) {
                    //	$modalInstance.close(productID);
                    //};
                    $scope.cancel = function () {
                        $modalInstance.dismiss("cancel");
                    };
                };
				$scope.openModal = function () {
					var modalInstance = $modal.open({
							templateUrl: "views/component/delrecycle.tpl.html",
							controller: ModalInstanceCtrl,
							windowClass: "app-modal-window"
					});
					modalInstance.result.then(function () {
                        var recycleId = $scope.deletedata.recycleId;
                        recycleService.deleteRecycle(recycleId).then(
                            function(stat){
                                console.log('xxx');
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
					scope.$apply(function(){
						scope.deletedata = ngModel.$modelValue;
					})
				});
			}
		}
	}]);
});





