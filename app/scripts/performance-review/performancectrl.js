define(['./module'],function(performance){
    'use strict';
    performance.controller('performanceCtrl', [
        '$scope','$timeout','Upload',
        function($scope, $timeout, Upload){
            $scope.files = null;
            $scope.dateBeginPickerOpen = false;
            $scope.toggleDateBeginPicker = function($event) {
                $event.stopPropagation();
                $scope.dateBeginPickerOpen = !$scope.dateBeginPickerOpen;
            };
            $scope.yearSelected= "";
            $scope.monthSelected= "";
            $scope.$watch( $scope.yearSelected, function(newv, oldv){
                console.log(newv);
            });
            $scope.upload = function(){
                var files = $scope.files;
                if (!files || !files.length) {return;}
                var file = files[0];
                Upload.upload({
                    url: '/performance/201507/upload',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' +
                        evt.config.file.name + '\n' + $scope.log;
                }).success(function (data, status, headers, config) {
                    $timeout(function() {
                        $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                    });
                });
            }
        }
    ]);
});
