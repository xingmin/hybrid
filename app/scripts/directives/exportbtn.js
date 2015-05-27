define(['./module', 'jquery', 'filesaver'],function(directives, $,saveAs){
    'use strict';	
    directives.directive("exportbtn", [function(){
		return{
			restrict: 'E',
            //scope: {
            //    dataTarget:'@dataTarget'
            //},
			controller: function($scope, $element, $attrs){
			},
			template: "<button type='button' class='btn btn-primary'>导出</button>",
			replace: true,
			link: function(scope, element, attrs){
                element.bind('click', function(){
                    var blob = new Blob([$(attrs["target"]).html()], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });
                    saveAs(blob, "Report.xls");
                });
			}
		}
	}]);
});





