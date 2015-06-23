define(['./module'],function(directives){
    'use strict';	
    directives.directive("pagesetup",['indexedDbService', function(indexedDbService){
        return{
            restrict:'AE',
            scope:{
                pageSize:'=',
                pageSizeStoreName:'@',
                pageSizeChanged:"@"
            },
            replace: true,
            controller:function($scope, $element, $attrs){
                $scope.$watch($scope.pageSize, function(newVal, oldVal){
                    if(newVal === oldVal){
                        return;
                    }
                    indexedDbService.setAppConfig($attrs["pageSizeStoreName"],newVal).then(
                        function(){
                            console.log("save "+$attrs["pageSizeStoreName"]+" succeeded！");
                        },
                        function(){console.log("save "+$attrs["pageSizeStoreName"]+" failed!")}
                    );
                });
                indexedDbService.getAppConfig($attrs["pageSizeStoreName"]).then(
                    function(data){
                        if(data && data.length>0){
                            $scope.pageSize = data;
                        }
                    }
                );
            },
            template:
                "<div class=\"btn-group\">"
                    +"<a type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"collapse\">"
                        +"设置<span class=\"caret\"></span>"
                    +"</a>"
                    +"<ul class=\"dropdown-menu collapse\">"
                        +"<li class=\"input-group\">"
                            +"<span class=\"input-group-addon\">页大小</span>"
                            +"<input type=\"text\" class=\"form-control\"  name=\"pagesize\" ng-model=\"pageSize\" placeholder=\"页大小\"/>"
                        +"</liv>"
                    +"</ul>"
                +"</div>",
            link:function(scope, element, attrs){
            }
        }
	}])
})





