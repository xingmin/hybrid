define(['require',        
        'angular',
        'jquery',
        'bootstrap',
        'angular-route',
        'angular-bootstrap',
      //  'modal-carousel',
        'appx',
        'router'
       
        //,
//        'mainController',
//        'mainDirective',
//        'mainService'
        ],function(require,angular){
	'use strict';
	require(['domReady!'],function(document){
		angular.bootstrap(document,['webapp']);
		//require(['bootstrap-toggle'],function(){})
	
		
	});
});