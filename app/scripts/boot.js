define(['require',
        'angular',
        'jquery',
        'bootstrap',
        'angular-route',
        'angular-bootstrap',
        'bootstrap-datepicker',
      //  'modal-carousel',
        'appx',
        'router',
        'appconfig'
        ],function(require,angular){
	'use strict';
	require(['domReady!'],function(document){
		angular.bootstrap(document,['webapp']);
		//require(['bootstrap-toggle'],function(){})
	});
});