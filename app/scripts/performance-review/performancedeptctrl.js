define(['./module', './performancedeptservice'],function(performance){
    'use strict';
    performance.controller('performanceDeptCtrl', [
        '$scope','$timeout','oaService', 'performanceDeptService',
        function($scope, $timeout,oaService, performanceDeptService){
            $scope.depts = null;
            $scope.search = function(){
                performanceDeptService.getPerformanceDepts($scope.pinyin).then(
                    function(depts){
                        $scope.depts = depts;
                    }
                );
            };
        }
    ]);
});
