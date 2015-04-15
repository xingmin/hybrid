define(['./module', 'socketio'],function(services,io){
    'use strict';
	services.factory("socketService",['$rootScope',function($rootScope){
		var socket = io();
		return{
			on:function(eventname, callback){
				socket.on(eventname,function(){
					var args = arguments;
					$rootScope.$apply(function(){
						callback.apply(socket, args);
					});
				})
			},
			emit:function(eventname, data, callback){
				socket.emit(eventname, data, function(){
					var args = arguments;
					$rootScope.$apply(function(){
						if(callback){
							callback.apply(socket, args);
						}
					});
				})
			}
		}
	}])
})

