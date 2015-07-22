define(['angular', "ng-file-upload"],function(angular){
    'use strict';
	var performanceMonth = angular.module("performance.month",['ngFileUpload','template/performanceUpload.html']);
	performanceMonth.controller("performanceUploadControll",['$scope', '$element', '$attrs','Upload',function($scope, $element, $attrs, Upload){
		var self = this;
		$scope.files=null;
		$scope.selectFileText = "选择文件";
		$scope.upload = function(){
			var files = $scope.files;
			if (!files || !files.length) {return;}
			var file = files[0];
			var url = "/performance/" + $scope.year + $scope.month +"/upload";
			Upload.upload({
				url: url,
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
	}]);
	performanceMonth.directive("performanceUpload", [function(){
		return{
			restrict: 'E',
			scope:{
				year:"@",
				month:"@"
			},
			controller: "performanceUploadControll",
			replace: false,
			templateUrl:"template/performanceUpload.html",
			link: function(scope, element, attrs){
			}
		}
	}]);
	angular.module("template/performanceUpload.html", []).run(["$templateCache", function($templateCache) {
		$templateCache.put("template/performanceUpload.html",
			"<ul class='list-inline'><li><button type=\"button\" class=\"btn btn-primary\" ngf-select accept=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\" ng-model=\"files\">选择文件</button>"
			+"</li>"
			+"<li>"
			+"<button type=\"button\" class=\"btn btn-primary\" ng-click=\"upload()\">上传</button>"
			+"</li></ul>");
	}]);
});





