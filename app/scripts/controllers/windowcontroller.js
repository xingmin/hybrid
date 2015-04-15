define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('windowController',['$scope','$http','$timeout','windowService',function($scope,$http,$timeout, windowService){
    	$scope.callWindows =null;
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	windowService.getAllWindows().success(function(data){
    		$scope.callWindows = data.value;
    	});
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if ($scope.mode == 'edit'){
    			windowService.saveChangeWindow($scope.currentedit.newval.id,$scope.currentedit.newval.name)
    				.success(function(data){
    					if(data.status==0){
    						$scope.currentedit.oldval.name = $scope.currentedit.newval.name;
    						$scope.isSaveCompleted = true;
    						$scope.msgs.push($scope.currentedit.newval.name+'修改成功！');
    					}});
    		}else if($scope.mode == 'create'){
    			windowService.createNewWindow($scope.currentedit.newval.name)
    			.success(function(data){
    				if(data.status==0){
    					$scope.callWindows.push(data.value);
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
    		if(mode == 'create'){
    			$scope.currentedit={newval:{},oldval:{}};
    		}
    	}
//    	$scope.showmsg = function(msg){
//    		$scope.msgs.push(msg);
//    		var timer = $timeout(function(){
//    			$scope.msgs.pop();
//    			$timeout.cancel(timer);
//    		},2000);
//    	};
    	$scope.deletecur = function(){
    		var cur = $scope.currentedit.oldval;
    		$scope.IsHideModal = false;
    		windowService.delWindow(cur.id).success(function(data){
    			if(data.status==0){
    				angular.forEach( $scope.callWindows, function(val,index){
    					if(val == cur){
    						$scope.currentedit={newval:{},oldval:{}};
    						$scope.callWindows.splice(index,1);						
    						$scope.IsHideModal = true;				
    						$scope.msgs.push(val.name+'删除成功！');
    					}
    				
    				})
    			}else{
    				$scope.msgs.push(data.message);
    			}
    		});

    	};
    }]);
})
