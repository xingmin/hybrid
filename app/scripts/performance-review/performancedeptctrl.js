define(['./module', './performancedeptservice'],function(performance){
    'use strict';
    performance.controller('performanceDeptCtrl', [
        '$scope','$timeout','oaService', 'performanceDeptService','messageService',
        function($scope, $timeout,oaService, performanceDeptService, messageService){
            $scope.depts = null;
            $scope.staticEmps = [];
            oaService.getStaticEmpsOfOA().then(
                function(emps){
                    $scope.staticEmps  = emps;
                }
            );
            $scope.search = function(){
                performanceDeptService.getPerformanceDepts($scope.pinyin).then(
                    function(depts){
                        $scope.depts = depts;
                    }
                );
            };
            $scope.$on('performanceDept-update', function(event, data){
                messageService.sendMessage(data.message);
            });
            $scope.$on('performanceDept-create', function(event, data){
                messageService.sendMessage(data.message);
            });
            $scope.$on('performanceDept-delete', function(event, data){
                messageService.sendMessage(data.message);
            });
        }
    ]);
});
