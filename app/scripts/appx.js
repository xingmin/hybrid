define(["angular",
        "angular-route",
        'angular-md5',
        'bootstrap-datetimepicker',
        'constants/mainconstant',
        'services/mainservice',
        'filters/mainfilter',
        'directives/maindirective',
        'controllers/maincontroller'
       ],function(angular){
    return angular.module("webapp",['ngRoute',
                                    'angular-md5',
                                    'ui.bootstrap',
                                    'ui.bootstrap.datetimepicker',
                                    'webapp.constants',
                                    'webapp.services',
                                    'webapp.filters',
                                    'webapp.directives',
                                    'webapp.controllers'                    
                                    ]);
})


