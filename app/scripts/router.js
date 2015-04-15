define(["./appx"],function(app){
	return app
//	.run([
//					'$rootScope',
//					'$state',
//					'$stateParams',
//					function ($rootScope, $state, $stateParams) {
//					    $rootScope.$state = $state;
//					    $rootScope.$stateParams = $stateParams
//					}
//	                ])
	               .config([	'$routeProvider',
								'$locationProvider',
								function($routeProvider, $locationProvider){
									$routeProvider
										.when('/',{
													templateUrl:'/views/tpl/welcome.html',
													controller:'welcomectrl'
										})
										.when('/register',{
											templateUrl:'/views/tpl/register.html',
											controller:'registerctrl'
										})
										.when('/register/success',{
											templateUrl:'/views/tpl/registersuccess.html'
										})
										.when('/test',{
											templateUrl:'/views/tpl/test.html'
										})
										.when('/queuesys/queue',{
											templateUrl:'/views/tpl/queue.html',
											controller: 'queue'
										})
										.when('/queuesys/externalsys',{
											templateUrl:'/views/tpl/externalsys.html',
											controller: 'externalSysController'
										})
										.when('/queuesys/queueclass',{
											templateUrl:'/views/tpl/queueclass.html',
											controller: 'queueclass'
										})
										.when('/queuesys/window',{
											templateUrl:'/views/tpl/window.html',
											controller: 'windowController'
										})
										.when('/queuesys/user',{
											templateUrl:'/views/tpl/user.html',
											controller: 'userController'
										})
										.when('/queuesys/user/login',{
											templateUrl:'/views/tpl/login.html',
											controller: 'userLoginController'
										})
										.when('/queuesys/userwindow',{
											templateUrl:'/views/tpl/userwindow.html',
											controller: 'userWindowController'
										})
										.when('/queuesys/user/choosewindow',{
											templateUrl:'/views/tpl/choosewindow.html',
											controller: 'chooseWindowController'
										})
										.when('/queuesys/queue/userqueue',{
											templateUrl:'/views/tpl/userqueue.html',
											controller: 'userQueueController'
										})
										.when('/queuesys/queue/fetchqueue',{
											templateUrl:'/views/tpl/fetchqueuenumber.html',
											controller: 'fetchQueueNumberController'
										})
										.when('/queuesys/queue/callperson',{
											templateUrl:'/views/tpl/callperson.html',
											controller: 'callPersonController'
										})
										.otherwise({
											redirectTo:'/'
										});
							//		$locationProvider.html5Mode(true);//以后再研究2
								}  
							])
							})
//angular.module('appx', ['ngRoute','angular-md5'])
//.config(
//[
//	'$routeProvider',
//	'$locationProvider',
//	function($routeProvider, $locationProvider){
//		$routeProvider
//			.when('/',{
//						templateUrl:'/views/tpl/welcome.html',
//						controller:'welcomectrl'
//			})
//			.when('/register',{
//				templateUrl:'/views/tpl/register.html',
//				controller:'registerctrl'
//			})
//			.when('/register/success',{
//				templateUrl:'/views/tpl/registersuccess.html'
//			})
//			.when('/test',{
//				templateUrl:'/views/tpl/test.html'
//			})
//			.when('/queuesys/queue',{
//				templateUrl:'/views/tpl/queue.html',
//				controller: 'queue'
//			})
//			.when('/queuesys/queueclass',{
//				templateUrl:'/views/tpl/queueclass.html',
//				controller: 'queueclass'
//			})
//			.otherwise({
//				redirectTo:'/'
//			});
////		$locationProvider.html5Mode(true);//以后再研究2
//	}  
//])
//.directive("edit",function($document){
//	  return{
//	    restrict: 'AE',
//	    require: 'ngModel',
//	    link: function(scope,element,attrs,ngModel){
//	       element.bind("click",function(){
//		       var ids = [];
//		       ids.push("txt_name_" +ngModel.$modelValue.id);
//		       ids.push("txt_maxcalltimes_" + ngModel.$modelValue.id)
//		       scope.$apply(function(){
//		    	   angular.copy(ngModel.$modelValue,scope.master);
//		         //console.log(scope.master);
//		       })
//		       //console.log(id);
//		       ids.forEach(function(id){
//			       var obj = $("#"+id);
//			       obj.removeClass("inactive");
//			       obj.addClass("active");
//			       obj.removeAttr("readOnly");
//
//	       		});			      
//		       scope.$apply(function(){
//		    	   scope.showEdit = false;
//			   });
//	      });
//	    }
//	  }
//})
//.directive("update",function($document){
//	  return{
//	    restrict: 'AE',
//	    require: 'ngModel',
//	    link: function(scope,element,attrs,ngModel){
//	      element.bind("click",function(){
//	         alert(ngModel.$modelValue + " is updated, Update your value here.");
//	         var ids = [];
//		     ids.push("txt_name_" +ngModel.$modelValue.id);
//		     ids.push("txt_maxcalltimes_" + ngModel.$modelValue.id);
//		     ids.forEach(function(id){
//		         var obj = $("#"+id);
//		         obj.removeClass("active");
//		         obj.addClass("inactive");
//		         obj.attr("readOnly",true);
//		     });
//	          scope.$apply(function(){
//	           scope.showEdit = true;
//	         })
//	      })
//	    }
//	  }
//})
//.directive("cancel",function($document){
//	  return{
//	    restrict: 'AE',
//	    require: 'ngModel',
//	    link: function(scope,element,attrs,ngModel){
//	      element.bind("click",function(){
//	         scope.$apply(function(){
//	           angular.copy(scope.master,ngModel.$modelValue);
//	           //console.log(ngModel.$modelValue);
//	         })
//	          
//	         var id = "txt_name_" +ngModel.$modelValue.id;
//	         var obj = $("#"+id);
//	         obj.removeClass("active");
//	         obj.addClass("inactive");
//	         obj.prop("readOnly",true);
//	          scope.$apply(function(){
//	           scope.showEdit = true;
//	         })
//	      })
//	    }
//	  }
//})
//.directive("delete",function($document){
//	  return{
//	    restrict:'AE',
//	    require: 'ngModel',
//	    link:function(scope, element, attrs,ngModel){
//	      element.bind("click",function(){
//	        var id = ngModel.$modelValue.id;
//	        alert("delete item where employee id:=" + id);
//	        scope.$apply(function(){
//	          for(var i=0; i<scope.employees.length; i++){
//	            if(scope.employees[i].id==id){
//	               console.log(scope.employees[i])
//	               scope.employees.splice(i,1);
//	            }
//	          }
//	          console.log(scope.employees);
//	        })
//	      })
//	    }
//	  }
//});



