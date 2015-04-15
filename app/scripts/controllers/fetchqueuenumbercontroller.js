define(['./module'],function(controllers){
	'use strict';
    controllers.controller('fetchQueueNumberController',
    		['$scope','$http','$timeout','socketService','queueService','queueClassService','indexedDbService',
    		 function($scope,$http,$timeout, socketService,queueService,queueClassService,indexedDbService){
		$scope.msgs=[];
		$scope.externalPersonId=null;
		//对socket进行监听配置 
		(function(){
			socketService.on('fetch-ticket-result',function(result){
				if(result.code === 0){
					console.log('fetch ticket succeeded.');
					$scope.msgs.push('fetch number succeeded.'+result.data.seqId);
				}else{
					console.log('fetch ticket failed.');
				}
			})})();
		//根据当前的对列类别取得其包含的队列
		$scope.getQueuesByCurrentClassId = function(){
			var arrSelected = $scope.getSelectedQueueClasses($scope.config.queueClasses);
			arrSelected.forEach(function(queueclass){
					queueService.getQueueInfoByClassId(queueclass.id).success(function(data){
						if(data.status === 0 && data.value){
							queueclass.queues = data.value;
						}
					});
			});			
		};
		//根据选择的当前队列类别初始化页面数据
		$scope.initContext = function(){
			$scope.config.compositMode = $scope.getCompositeMode();
			$scope.getQueuesByCurrentClassId();			
	    	socketService.emit('join-room', {'roomtype':'fetch-ticket',
	    		'data':$scope.getSelectedQueueClasses($scope.config.queueClasses)},
	    			function(stat){
	    		if(stat.code === 0){
	    			console.log('join-room-result:'+stat.message);
	    		}
	    	});
		};
		//获得当前选中的队列类别数组
		$scope.getSelectedQueueClasses = function(queueclasses){
			var arrSelected = [];
			if(queueclasses && queueclasses.length>0){
	    		queueclasses.forEach(function(queueclass){
	    			if(queueclass.isSelected) arrSelected.push(queueclass);
	    		});
			}
			return arrSelected;
		};
		//获取当前选择的队列类别是“复杂”模式还是“简单”模式
		$scope.getCompositeMode = function(){
			var arrQC = $scope.getSelectedQueueClasses($scope.config.queueClasses);
			var mode = 0;
			arrQC.every(function(qc){
				if(qc.mode === 1){
					mode=1;
					return false;
				}
				return true;
			});
			return mode;
		};
		//组合当前选择的所有的队列
		//选择的当前队列类别保存至本地
		$scope.config={
				compositMode:0,
				queueClasses:null,
				toggleSelectQueueClass:function(queueclass){
					queueclass.isSelected = !queueclass.isSelected;
					indexedDbService.setAppConfig('current-queue-class',
							$scope.getSelectedQueueClasses($scope.config.queueClasses))
						.then(
								function(){
									console.log('save configuration succeeded！');
									$scope.initContext();
								},
								function(){console.log('failed!')}
							);
				}
		};
		//初始化页面的队列类别列表数据
		queueClassService.getAllQueueClasses().success(function(data){
			$scope.config.queueClasses = data.value;
			indexedDbService.getAppConfig('current-queue-class')
				.then(
					function(data){
						data.forEach(function(savedQueueClass){
							$scope.config.queueClasses.forEach(function(val){
								if(val.id === savedQueueClass.id){
									val.isSelected = true;
								}
							});
						});
						$scope.initContext();
					},
					function(){console.log('failed!');}
				);
		});
		$scope.selectQueue = function(queue){
			$scope.selectedQueue = queue;
		};
		$scope.fetchQueueNumber = function(queueid){
	    	socketService.emit('fetch-ticket',{queueId:queueid, externalPersonId:$scope.externalPersonId},function(stat){
	    		if(stat.status === 0){
	    			console.log('join-room-result:'+stat.message)
	    		}
	    	});
		};
	}]);
})
