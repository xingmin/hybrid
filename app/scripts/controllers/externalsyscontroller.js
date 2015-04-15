define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('externalSysController',['$scope','$http','$timeout','externalSysService',function($scope,$http,$timeout, externalSysService){
    	$scope.externalSyses =null;
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	externalSysService.getAllExternalSys().success(function(data){
    		$scope.externalSyses = data.value;
    	});
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if ($scope.mode == 'edit'){
    			externalSysService.saveChangeExternalSys($scope.currentedit.newval.id,
    					$scope.currentedit.newval.name,
    					$scope.currentedit.newval.pinyin,
    					$scope.currentedit.newval.easyId)
    				.success(function(data){
    					if(data.status==0){
    						$scope.currentedit.oldval.name = $scope.currentedit.newval.name;
    						$scope.currentedit.oldval.pinyin = $scope.currentedit.newval.pinyin;
    						$scope.currentedit.oldval.easyId = $scope.currentedit.newval.easyId;
    						$scope.isSaveCompleted = true;
    						$scope.msgs.push($scope.currentedit.newval.name+'修改成功！');
    					}});
    		}else if($scope.mode == 'create'){
    			externalSysService.createNewExternalSys($scope.currentedit.newval.name,
    					$scope.currentedit.newval.pinyin,
    					$scope.currentedit.newval.easyId)
    			.success(function(data){
    				if(data.status==0){
    					$scope.externalSyses.push(data.value);
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
    		
    	};
    	$scope.translateexternalSysMode = function(mode){
    		return (mode==0?'简单':(mode==1?'复杂':''));
    	};
    	$scope.deletecur = function(){
    		var cur = $scope.currentedit.oldval;
    		$scope.IsHideModal = false;
    		externalSysService.delExternalSys(cur.id).success(function(data){
    			if(data.status==0){
    				angular.forEach( $scope.externalSyses, function(val,index){
    					if(val == cur){
    						$scope.currentedit={newval:{},oldval:{}};
    						$scope.externalSyses.splice(index,1);						
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
