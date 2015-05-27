require.config({
	baseUrl:'scripts',
	paths:{
		'jquery':'../bower_components/jquery/dist/jquery',
		'angular':'../bower_components/angular/angular',
		'angular-route':'../bower_components/angular-route/angular-route',
		'angular-md5':'../bower_components/angular-md5/angular-md5',
		'angular-bootstrap':'../bower_components/angular-bootstrap/ui-bootstrap-tpls',
		'bootstrap':'../bower_components/bootstrap/dist/js/bootstrap',
		'bootstrap-toggle':'../bower_components/bootstrap-toggle/js/bootstrap2-toggle',
		'bootstrap-datepicker':'../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker',
		'bootstrap-validator':'../bower_components/bootstrap-validator/dist/validator',
        'filesaver':'../bower_components/FileSaver/FileSaver',
		//'modal-carousel':'../bower_components/bootstrap-modal-carousel/dist/js/bootstrap-modal-carousel',
		'lodash':'../bower_components/lodash/lodash',
		'socketio':'/socket.io/socket.io',
		'moment':'../bower_components/moment/moment',
		'domReady':'lib/domReady',
		'boot':'boot',
		'appx':'appx',
		'router':'router',
		'appconfig':'appconfig'
	},
	shim:{
		'bootstrap':{
			deps:['jquery'],
			exports:'bootstrap'
		},
		'bootstrap-toggle':{
			deps:['jquery','bootstrap'],
			exports:'bootstrap-toggle'
		},
		'bootstrap-datepicker':{
			deps:['jquery','bootstrap'],
			exports:'bootstrap-datepicker'
		},
        'bootstrap-validator':{
            deps:['jquery','bootstrap'],
            exports:'bootstrap-validator'
        },
        'filesaver':{
            exports:'filesaver'
        },
		'angular':{
			exports:'angular'
		},
		'angular-route':{
			deps:['angular'],
			exports:'angular-route'
		},
		'angular-md5':{
			deps:['angular'],
			exports:'angular-md5'	
		},
		'angular-bootstrap':{
			deps:['angular'],
			exports:'angular-bootstrap'	
		}
	},
	deps:['boot']
});