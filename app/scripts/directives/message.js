define(['angular'],function(angular) {
	'use strict';
    return angular.module('my.message',[])
        .factory("messageService",[function(){
            var _service = {};
            var _messages = [];
            var _sendMessage = function(msg){
                _messages.push(msg);
            };
            var _popMessage = function(){
                _messages.pop();
            };
            _service.sendMessage = _sendMessage;
            _service.popMessage = _popMessage;
            _service.getMessageQueue = function(){return _messages};
            return _service;
        }])
        .directive("message",['$timeout','messageService',function($timeout, messageService){
            return{
                restrict:'E',
                template: '	<div class="alert alert-danger"  ng-repeat="msg in messages track by $index">'
                +'<a class="close" data-dismiss="alert">x</a>'
                +'<strong>{{msg}}</strong></div>',
                controller: function($scope, $element, $attrs){
                    $scope.messages = messageService.getMessageQueue();
                    $scope.$watchCollection(function(){return $scope.messages}, function(newval, oldval){
                        if(newval.length > oldval.length){
                            var timer = $timeout(function(){
                                messageService.popMessage();
                                $timeout.cancel(timer);
                            },3000);
                        }
                    });
                },
                link:function(scope, element, attrs,ngModel){
                }
            };
        }]);
})





