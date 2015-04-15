define(['./module'],function(directives){
    'use strict';
	directives.directive("edit",function(){
		  return{
		    restrict: 'AE',
		    require: '^ngModel',
		    scope:{editdata:'=editData'},
		    link: function(scope,element,attrs, ngModel){
		       element.bind("click",function(){
			      scope.$apply(function(){
			    	  scope.editdata.oldval = ngModel.$modelValue; 
			    	  scope.editdata.newval = angular.copy(ngModel.$modelValue);
			      }) 
	//	    	   console.log(scope.editdata == scope.$parent.currentedit)
		      });
		    }
		  }
	})
	.directive("delete",function(){
		  return{
		    restrict:'E',
		    require: 'ngModel',
		    scope:{deletedata:'=delData'},
		    link:function(scope, element, attrs,ngModel){
		    	element.bind("click",function(){
			      scope.$apply(function(){
			    	  scope.deletedata.oldval = ngModel.$modelValue; 
			    	  scope.deletedata.newval = angular.copy(ngModel.$modelValue);
			      }) 
		    	});
		    }
		  }
	})
	.directive("deletedlg",function(){
		  return{
			    restrict:'E',
			    transclude: true,
			    templateUrl: 'views/component/deldlg.html',
			    scope:{dodelete:'&doDel', ishide:'@isHide'},
			    link:function(scope, element, attrs){
			    	$(element[0].children[0]).attr('id', attrs['dlgid'])
			    	scope.$watch('ishide',function(newval, oldval){
			    		if(newval == 'true' && $(element[0].children[0])[0].style.display=='block'){
			    			$(element[0].children[0]).modal('hide');
			    		}
			    	});
			    }
			  }
	})
	.directive("editdlg",function(){
		  return{
			    restrict:'E',
			    transclude: true,
			    templateUrl: 'views/component/editdlg.html',
			    scope:{
			    	ishide:'@isHide',
			    	modulename:'@moduleName'
			    },
			    link:function(scope, element, attrs){
	//		    	$(element[0].children[0]).attr('name', attrs['dlgFormName']);
			    	$(element[0].children[0]).attr('id', attrs['dlgid']);
			    	scope.$watch('ishide',function(newval, oldval){
			    		var elm = $(element[0].children[0]);
			    		if(newval == 'true' && elm[0].style.display=='block'){
			    			elm.modal('hide');
			    		}
			    	});
			    }
			  }
	})
	.directive("msgbox",function($timeout){
		  return{
		    restrict:'E',
		    scope:{
		    	messages:'=messages'
		    },
		    template: '	<div class="alert alert-danger"  ng-repeat="msg in messages track by $index">'
					+'<a class="close" data-dismiss="alert">x</a>'
					+'<strong>{{msg}}</strong></div>',
		    link:function(scope, element, attrs,ngModel){
		    	scope.$watchCollection(function(){return scope.messages}, function(newval, oldval){
		    		if(newval.length > oldval.length){
		    			var timer = $timeout(function(){
		    				scope.messages.pop();
		    				$timeout.cancel(timer);
		    			},3000);
		    		}
		    	});
		    }
		  }
	})
	.directive("pyinput",function($timeout){
		return{
			restrict:'E',
			scope:{
				showColumns:'=showColumns',
				fullfillColumn:'@fullfillColumn',
				selectedItem:'=selectedItem',
				py:'=',
				query:'&'
			},
			template: '<input type="text" class="form-control dropdown-toggle" data-toggle="dropdown" required ng-model="py" />'
				+'<ul class="dropdown-menu" role="menu" style="margin-left:15px;">'
				+'<li ng-repeat="item in menuItmes">'
					+'<ul class="list-inline" ng-click="selectMenuItem($index)">'
	 				+'<li ng-repeat="col in showColumns">'
					+'<a href="javascript:void(0);" >{{item[col]}}</a>'
	 				+'</li>'
					+'</ul>'
				+'</li>'
				+'</ul>',
		    link:function(scope, element, attrs){
		    	var timeout;
		    	scope.selectMenuItem = function(selectedIndex){
		    		scope.selectedItem = scope.menuItmes[selectedIndex];
		    		scope.py = scope.selectedItem[attrs.fullfillColumn];
		    	};
		    	scope.$watch(function(){return scope.py}, function(newval, oldval){
	//	    		if(newval == oldval){return;}
		    		if(newval){
		    			if (timeout) $timeout.cancel(timeout);
		    			timeout = $timeout(function(){
		    				scope.query().success(function(data){
		    					scope.menuItmes = data.value;
		    				});
		    			},350);
		    		}
		    	});
		    }
		  }
	})
})





