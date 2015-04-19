define(['./module', 'moment'],function(controllers, moment){
    'use strict';
    controllers.controller('drawController',
    		['$scope','$http','$timeout','drawService',
    		 function($scope,$http,$timeout, drawService){
    	$scope.moment = moment;
    	$scope.draws = [];
    	$scope.scanner = {barcodeCollecter : ''};
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	$scope.queryParam={
    			dateBegin:moment().format('YYYY-MM-DD'),
    			dateEnd:moment().format('YYYY-MM-DD')
    	};
    	$scope.query = function(){
        	drawService.getDrawsByDate($scope.queryParam.dateBegin, $scope.queryParam.dateEnd)
    		.then(function(receive){
	    		console.log($scope.queryParam.dateBegin);
	    		console.log($scope.queryParam.dateEnd);
	    		$scope.draws = receive.data.value;
	    		return $scope.draws;
    		})
    		.then(function(draws){
    			draws && draws.length>0 && draws.every(function(draw){
    				drawService.getDrawDetailsByDrawId(draw.id)
    					.success(function(data){
    						draw.drawDetails = data.value;
    					})
    			});
    		});
    	};
    	$scope.query();
    	$scope.saveChange = function(){
    		$scope.isSaveCompleted = false;
    		if ($scope.mode == 'edit'){
    			drawService.saveChangeDraw($scope.currentedit.newval.id,
    					$scope.currentedit.newval.consumer,
    					$scope.currentedit.newval.receiver,
    					$scope.currentedit.newval.remark,
    					$scope.currentedit.newval.drawer,
    					$scope.currentedit.newval.drawDetails
    					)
    				.success(function(data){
    					if(data.status==0){
    						$scope.currentedit.oldval.consumer = $scope.currentedit.newval.consumer;
    						$scope.currentedit.oldval.receiver = $scope.currentedit.newval.receiver;
    						$scope.currentedit.oldval.remark = $scope.currentedit.newval.remark;
    						$scope.currentedit.oldval.drawer = $scope.currentedit.newval.drawer;
    						$scope.currentedit.oldval.drawer = $scope.currentedit.newval.drawDetails;
    						$scope.isSaveCompleted = true;
    						$scope.msgs.push('修改成功！');
    					}});
    		}else if($scope.mode == 'create'){
    			drawService.createNewDraw(
    					$scope.currentedit.newval.consumer,
    					$scope.currentedit.newval.receiver,
    					$scope.currentedit.newval.remark,
    					$scope.currentedit.newval.drawer,
    					$scope.currentedit.newval.drawDetails
    					)
    			.success(function(data){
    				if(data.status==0){
    					$scope.draws.push(data.value);
    					$scope.isSaveCompleted = true;
    					$scope.msgs.push('创建成功！');
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
    	$scope.deletecur = function(){
    		var cur = $scope.currentedit.oldval;
    		$scope.IsHideModal = false;
    		drawService.deleteDraw(cur.id).success(function(data){
    			if(data.status === 0){
    				angular.forEach( $scope.draws, function(val,index){
	    					if(val == cur){
	    						$scope.currentedit={newval:{},oldval:{}};
	    						$scope.draws.splice(index,1);				
	    						$scope.IsHideModal = true;
	    						$scope.msgs.push('删除成功！');
	    					}
    				});
    			}else{
    				$scope.msgs.push(data.message);
    			}
    		});
    	};
    	$scope.addDrawDetail = function(event, barcode){
    		if(event.which === 13){
	    		if( !angular.isArray($scope.currentedit.newval.drawDetails)){
	    			$scope.currentedit.newval.drawDetails=[];
	    		}
	    		$scope.currentedit.newval.drawDetails.push({'barcode':barcode});
	    		$scope.scanner.barcodeCollecter = '';
	    		event.preventDefault();
    		}
    	};
    }]);
});
