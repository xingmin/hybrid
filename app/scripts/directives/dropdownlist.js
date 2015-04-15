define(['./module'],function(directives){
    'use strict';	
    directives.directive("dropdownlist",function($timeout){
		  return{
		    restrict:'E',
		    scope:{
		    	menuItems:'=menuItems',
		    	showInMenuItemNames:'=showInMenuItemNames',
		    	showTopName:'@showTopName',
		    	selectedItem:'=selectedItem',
		    },	    
		    template:
		    	'<div class="btn-group">'
//		    	+'<button class="btn"></button>'
		    	+'<button class="btn dropdown-toggle" data-toggle="dropdown">{{selectedItem[strShowTopName]}}<span class="caret"></span></button>'
				+'<ul class="dropdown-menu" role="menu">'
					+'<li ng-repeat="item in menuItems">'
		 				+'<ul class="list-inline" ng-click="selectMenuItem($index)">'
		 				+'<li ng-repeat="col in showInMenuItemNames">'
						+'<a href="javascript:void(0);" >{{item[col]}}</a>'
		 				+'</li>'
						+'</ul>' 
					+'</li>'		   
				+'</ul>'
				+'</div>',
		    link:function(scope, element, attrs){
		    	scope.strShowTopName=attrs['showTopName'];
		    	scope.selectMenuItem = function(selectedIndex){
		    		scope.selectedItem = scope.menuItems[selectedIndex];
//		    		scope.showTopValue = scope.selectedItem[attrs['showTopName']];
		    	};
		    }
		  }
	})
})





