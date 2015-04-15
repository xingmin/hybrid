define(['./module'],function(controllers){
	'use strict';
	controllers.controller('callPersonController',
			['$scope','$http','$timeout', '$q',
			'userService', 'socketService', 'queueService',
			'ticketService','dictService','personService',
			function($scope, $http, $timeout, $q,
					userService, socketService, queueService,
					ticketService, dictService,personService){
		$scope.currentUser = userService.getCurrentUser();
		$scope.msgs=[];
		$scope.queues = [];
		//排队状态字典获取
		$scope.dictQueueStatus = [];
		dictService.getQueueStatus()
			.then(
					function(recv){
						$scope.dictQueueStatus = recv.data.value;
					}
			);
		//获得当前登录用户的可查看队列的正排队的人员
		queueService.getUserAvilableQueueDetail($scope.currentUser.id)
			.then(
					function(recv){
						if(recv.data.status === 0){
							$scope.queues = recv.data.value;
						}
						return $scope.queues;
					}
			)
			.then(
					function(queues){
						//获取每个队列当前正在排队的列表
						var arrPromises = queues.map(function(queue){
							return ticketService.getQueuingTicketsByQueueId(queue.id);
						});
						return $q.all(arrPromises);
					}
			)
			.then(
					function(arrRecv){
						$scope.queues.forEach(function(queue, index, queues){
							queue.tickets = arrRecv[index].data.value;
						});
						//根据ticket中的personid获取其姓名等信息
						$scope.queues.forEach(function(queue, index, arr){
							queue.tickets.every(function(ticket){
								personService.getPersonById(ticket.personId)
									.then(function(recv){
										ticket.person = recv.data.value;
									});
							});
						});
						return $scope.queues;
					}
			);
		
	}]);
});
