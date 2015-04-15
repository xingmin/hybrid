define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('queue',['$scope','$http','$timeout','queueService','queueClassService',
                     function($scope,$http,$timeout, queueService,queueClassService){
	$scope.queues =null;
	$scope.IsHideModal = true;
	$scope.msgs=[];
	$scope.mode = '';
	$scope.currentedit={newval:{},oldval:{}};
	$scope.isSaveCompleted = false;
	$scope.submitInvalid = false;
	$scope.searchPinyin = {
			"py":"",
			"selectedItem" : {},
			"showColumns":["id","name"],
			"queryByPinyin":function(){
				return queueClassService.getQueueClassesByPinyin($scope.searchPinyin.py);
			}
	};
	$scope.$watch('currentedit.newval', function(){
		$timeout(function(){
			$scope.searchPinyin.py = $scope.currentedit.newval.queueClassName || '';
			},600);
	});
	queueService.getAllQueues().success(function(data){
		$scope.queues = data.value;
	});
	$scope.saveChange = function(){
		//提交前验证
		//$scope.submitInvalid = false;
//		$scope.submitInvalid = true;
//		return;
		if($scope.searchPinyin.py && $scope.searchPinyin.selectedItem.id){
			$scope.currentedit.newval.queueClassId = $scope.searchPinyin.selectedItem.id;
			$scope.currentedit.newval.queueClassName = $scope.searchPinyin.selectedItem.name;
		}
		if(!$scope.currentedit.newval.queueClassId){
			$scope.msgs.push('请选择队列类别');
			return;
		}
		$scope.isSaveCompleted = false;
		if ($scope.mode === 'edit'){
			queueService.saveChangeQueue($scope.currentedit.newval.id,
					$scope.currentedit.newval.name,
					$scope.currentedit.newval.maxCallTimes,
					$scope.currentedit.newval.queueClassId,
					$scope.currentedit.newval.isActive)
				.success(function(data){
					if(data.status==0){
						$scope.currentedit.oldval.name = $scope.currentedit.newval.name;
						$scope.currentedit.oldval.maxCallTimes = $scope.currentedit.newval.maxCallTimes;
						$scope.currentedit.oldval.queueClassId = $scope.currentedit.newval.queueClassId;
						$scope.currentedit.oldval.queueClassName = $scope.currentedit.newval.queueClassName;
						$scope.currentedit.oldval.isActive = $scope.currentedit.newval.isActive;						
						$scope.isSaveCompleted = true;
						$scope.msgs.push($scope.currentedit.newval.name+'修改成功！');
					}});
		}else if($scope.mode == 'create'){
			queueService.createNewQueue($scope.currentedit.newval.name,
					$scope.currentedit.newval.maxCallTimes,
					$scope.currentedit.newval.queueClassId,
					$scope.currentedit.newval.isActive)
			.success(function(data){
				if(data.status==0){
					$scope.currentedit.newval.id = data.value.id;
					$scope.queues.push($scope.currentedit.newval);
					$scope.isSaveCompleted = true;
					$scope.msgs.push(data.value.name+'创建成功！');
				}});	
		}
	};
	//create --新建
	//edit --编辑
	//del --删除
	$scope.changeEditMode = function(mode){
		$scope.mode = mode;
		if(mode === 'create'){
			$scope.currentedit={newval:{},oldval:{}};
		}
	};
//	$scope.showmsg = function(msg){
//		$scope.msgs.push(msg);
//		var timer = $timeout(function(){
//			$scope.msgs.pop();
//			$timeout.cancel(timer);
//		},2000);
//	};
	$scope.deletecur = function(){
		var cur = $scope.currentedit.oldval;
		$scope.IsHideModal = false;
		queueService.delQueue(cur.id).success(function(data){
			if(data.status==0){
				angular.forEach( $scope.queues, function(val,index){
					if(val == cur){
						$scope.currentedit={newval:{},oldval:{}};
						$scope.queues.splice(index,1);						
						$scope.IsHideModal = true;				
						$scope.msgs.push(val.name+'删除成功！');
					}
				
				})
			}else{
				$scope.msgs.push(data.message);
			}
		});

	};
}])
})