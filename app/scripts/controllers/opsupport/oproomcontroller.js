define(['../module'],function(controllers,$){
    'use strict';
    controllers.controller('oproomController',
    		['$scope','$http','$timeout','oproomService',
    		 function($scope, $http, $timeout, oproomService){
    	$scope.msgs=[];
    	$scope.oprooms = oproomService.getOprooms();
        //
    	//$scope.$on('oprooms.refresh', function(data){
         //   $scope.oprooms = oproomService.oprooms;
    	//});
    	$scope.IsHideModal = true;
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if($scope.mode == 'create'){
                oproomService.saveNewOproom($scope.currentedit.newval.name);
    		}
    	};
    	$scope.$on('oprooms.created', function(event, data){
            $scope.msgs.push(data.msg);
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
            oproomService.delOproom(cur.name);
    	};
    	$scope.$on('oprooms.deleted', function(event, data){
    		$scope.currentedit={newval:{},oldval:{}};
            $scope.msgs.push(data.msg);
    		$scope.IsHideModal = true;
    	});
    }]);
})
