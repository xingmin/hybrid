define(['./module', 'lodash'],function(directives, _){
    'use strict';	
    directives.directive("oproominput",['$timeout','oproomService', function($timeout, oproomService){
		return{
			restrict:'E',
			scope:{
                oproom:'='
			},
            controller: function($scope, $element, $attrs){
                $scope.showColumns = ['name'];
                $scope.fullfillColumn = 'name';
                oproomService.getOproomsPromise({name: $scope.py}).success(
                    function(data){
                        if(data.code === 0) {
                            $scope.menuItmes = data.value;
                            _.forEach($scope.menuItmes, function(val, index){
                                val.matched = true;
                            });
                        }else{
                            $scope.menuItmes = [];
                        }
                    }
                ).error(
                    function(){
                        $scope.menuItmes = [];
                    }
                );
                $scope.$watch(function(){return $scope.py}, function(newval, oldval){
                    var timeout;
                    if(newval){
                        if (timeout) $timeout.cancel(timeout);
                        timeout = $timeout(function(){
                            var strregex = $scope.py.trim()===''? '.*':$scope.py.trim().toUpperCase();
                            var regex = RegExp('^'+strregex);
                            _.forEach($scope.menuItmes, function(val, index){
                                val.matched = regex.test(val.name);
                            });
                        },350);
                    }
                });
                $scope.$watch(function(){return $scope.oproom}, function(newval, oldval){
                    $scope.py = _.result( _.find($scope.menuItmes, {name: newval}), 'name');
                });
                $scope.selectMenuItem = function(selectedIndex){
                    $scope.selectedItem = $scope.menuItmes[selectedIndex];
                    $scope.py = $scope.selectedItem[$scope.fullfillColumn];
                    $scope.oproom = $scope.selectedItem['name'];
                };
            },
			template:
			'<input type="text" class="form-control dropdown-toggle" data-toggle="dropdown" required ng-model="py" />'
			+'<ul class="dropdown-menu" role="menu" style="margin-left:15px;">'
			+"<li ng-repeat=\"item in menuItmes track by $index\" ng-hide=\"!menuItmes[$index].matched\">"
			+'<ul class="list-inline" ng-click="selectMenuItem($index)">'
			+'<li ng-repeat="col in showColumns">'
			+'<a href="javascript:void(0);" >{{item[col]}}</a>'
			+'</li>'
			+'</ul>'
			+'</li>'
			+'</ul>',
			link: function(scope, element, attrs){
			}
		}
	}])
});





