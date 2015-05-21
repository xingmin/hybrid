define(["angular",
        "angular-route",
        'angular-md5',
        'constants/mainconstant',
        'services/mainservice',
        'filters/mainfilter',
        'directives/maindirective',
        'controllers/maincontroller'
       ],function(angular){
    return angular.module("webapp",['ngRoute',
                                    'angular-md5',
                                    'ui.bootstrap',
                                    'webapp.constants',
                                    'webapp.services',
                                    'webapp.filters',
                                    'webapp.directives',
                                    'webapp.controllers'                    
                                    ]);
})


