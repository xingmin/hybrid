define(["angular",
        "angular-route",
        'angular-md5',
        'bootstrap-datetimepicker',
        'angular-ui-select',
        'constants/mainconstant',
        'services/mainservice',
        'filters/mainfilter',
        'directives/maindirective',
        'controllers/maincontroller',
        'performance-review/index'
       ],function(angular){
    return angular.module("webapp",['ngRoute',
                                    'angular-md5',
                                    'ui.bootstrap',
                                    'ui.bootstrap.datetimepicker',
                                    'ui.select',
                                    'webapp.constants',
                                    'webapp.services',
                                    'webapp.filters',
                                    'webapp.directives',
                                    'webapp.controllers',
                                    'performance'
                                    ]);
})


