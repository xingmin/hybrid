define(['./module', 'moment'],function(controllers, moment){
    'use strict';
    controllers.controller('drawController',
    		['$scope','$http','$timeout','drawService',
    		 'recycleService',
    		 function($scope
    				 ,$http
    				 ,$timeout
    				 ,drawService
    				 ,recycleService){
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
    			draws && draws.length>0 && draws.forEach(function(draw){
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
    				.then(function(recv){
    					var data = recv.data;
    					if(data.status==0){
    						$scope.currentedit.oldval.consumer = $scope.currentedit.newval.consumer;
    						$scope.currentedit.oldval.receiver = $scope.currentedit.newval.receiver;
    						$scope.currentedit.oldval.remark = $scope.currentedit.newval.remark;
    						$scope.currentedit.oldval.drawer = $scope.currentedit.newval.drawer;
    						$scope.currentedit.oldval.drawDetails = $scope.currentedit.newval.drawDetails;
    						$scope.isSaveCompleted = true;
    						$scope.msgs.push('修改成功！');
    						return $scope.currentedit.oldval;
    					}})
    				.then(
	    					function(newDraw){
	    						if(newDraw){
	    		    				drawService.getDrawDetailsByDrawId(newDraw.id)
	    	    					.success(function(data){
	    	    						newDraw.drawDetails = data.value;
	    	    					});
	    						}
	    					}
    				);
    		}
    		if($scope.mode == 'create'){
    			drawService.createNewDraw(
    					$scope.currentedit.newval.consumer,
    					$scope.currentedit.newval.receiver,
    					$scope.currentedit.newval.remark,
    					$scope.currentedit.newval.drawer,
    					$scope.currentedit.newval.drawDetails
    					)
    			.then(function(receive){
	    				var data = receive.data;
	    				if(data.status === 0){
	    					$scope.draws.push(data.value);
	    					$scope.isSaveCompleted = true;
	    					$scope.msgs.push('创建成功！');
	    					return data.value;
	    				}else{
	    					$scope.msgs.push('保存失败：'+data.errmsg);
	    					return null;
	    				}
	    				
	    		})//从数据库加载保存成功后的Details记录
    			.then(
    					function(newDraw){
    						if(newDraw){
    		    				drawService.getDrawDetailsByDrawId(newDraw.id)
    	    					.success(function(data){
    	    						newDraw.drawDetails = data.value;
    	    					});
    						}
    					}
    			);
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
    	$scope.deleteDrawDetail = function(arrDrawDetail, drawDetail){
    		arrDrawDetail 
    			&& arrDrawDetail.length>0 
    			&& arrDrawDetail.splice(arrDrawDetail.indexOf(drawDetail),1);
    	};
    	//下面是回收的操作
    	$scope.recycle = {};
    	$scope.recycle.isRecycleSaved = false;
    	$scope.recycle.msgs = [];
    	$scope.recycle.barcodeCollecter = '';
    	$scope.recycle.initRecycleModal = function(){
    		$scope.recycle.barcodeCollecter='';
    		$scope.recycle.arrRecycleDetail=[];
    	};
    	$scope.recycle.collectBarcode = function(event, barcode){
    		if(event.which === 13){
	    		if( !angular.isArray($scope.recycle.arrRecycleDetail)){
	    			$scope.recycle.arrRecycleDetail=[];
	    		}
	    		$scope.recycle.arrRecycleDetail.push({'barcode':barcode, 'useFlag':0});
	    		$scope.recycle.barcodeCollecter = '';
	    		event.preventDefault();
    		}
    	};
    	$scope.recycle.deleteBarcode = function(arrDrawDetail, detail){
    		arrRecycleDetail 
				&& arrRecycleDetail.length>0 
				&& arrRecycleDetail.splice(arrRecycleDetail.indexOf(detail),1);
    	};
    	$scope.recycle.saveRecycle = function(){
    		recycleService.createNewRecycle(
    				$scope.recycle.returner,
    				$scope.recycle.recycler,
    				$scope.recycle.remark,
    				$scope.recycle.recycleDetails
    				)
	    		.then(
	    				function(recv){
	    					var recycle = recv.data.value;
	    	    			return recycle;//recycle对象		
	    				},
	    				function(recv){
	    					var data = recv.data;
	    					$scope.recyle.msgs.push('保存失败：'+data.errmsg);
	    				}
	    		)
	    		.then(
	    				function(recycle){        			 
	    					return recycleService.getRecycleDetails(recycle.id)	    					
	    				}
	    		)
	    		.then(
	    				function(recv){
	    					var recycleDetails = recv.data.value;
	        				angular.forEach( $scope.draws, function(draw){
	        					angular.forEach(draw.drawDetails, function(drawDetail){
		        				});
	        				});
	    				}
	    		)
    	};
    }]);
});
