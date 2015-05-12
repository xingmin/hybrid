define(['../module'],function(controllers,$){
    'use strict';
    controllers.controller('roleController',
    		['$scope','$http','$timeout','roleFactory',
    		 function($scope, $http, $timeout, roleFactory){
    	$scope.msgs=[];    	
    	$scope.roles = roleFactory.getRoles();
    	$scope.$on('role.update', function(code){
    		if(code === 0){
    			$scope.msgs.push('获取成功');
    		}
    	});
    	$scope.IsHideModal = true;
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if($scope.mode == 'create'){
    			roleFactory.saveNewRole($scope.currentedit.newval.name);
    		}
    	};
    	$scope.$on('role.created', function(event, code){
    		if(code === 0){
    			$scope.msgs.push('保存成功');
    		}else{
    			$scope.msgs.push('保存失败');
    		}
    		$scope.isSaveCompleted = true;	
    	});
    	//create --新建
    	//edit --编辑
    	//del --删除
    	$scope.changeEditMode = function(mode){
    		$scope.mode = mode;
    		if(mode == 'create'){
    			$scope.currentedit={newval:{},oldval:{}};
    		}
    	}
    	$scope.deletecur = function(){
    		var cur = $scope.currentedit.oldval;
    		$scope.IsHideModal = false;
    		roleFactory.delRole(cur.name);
    	};
    	$scope.$on('role.deleted', function(event, code){
    		$scope.currentedit={newval:{},oldval:{}};
    		if(code === 0){    			
				$scope.msgs.push('删除成功');				
    		}else{
    			$scope.msgs.push('删除失败');
    		}
    		$scope.IsHideModal = true;
    	});
    }]);
})
