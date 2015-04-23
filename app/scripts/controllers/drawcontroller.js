define(['./module'],function(controllers){
    'use strict';
    controllers.controller('drawController',
    		['$scope','$http','$timeout','drawService',
    		 'recycleService',
    		 '_',
    		 'moment',
    		 function($scope
    				 ,$http
    				 ,$timeout
    				 ,drawService
    				 ,recycleService
    				 ,_
    				 ,moment
    				 ){
    	//$scope.moment = moment;
    	//$scope._ = _;
    	$scope.draws = [];
    	$scope.scanner = {barcodeCollecter : ''};
    	$scope.IsHideModal = true;
    	$scope.msgs=[];
    	$scope.mode = '';
    	$scope.currentedit={newval:{},oldval:{}};
    	$scope.isSaveCompleted = false;
    	$scope.queryParam={
    			dateBegin  : moment().format('YYYY-MM-DD'),
    			dateEnd    : moment().format('YYYY-MM-DD'),
    			barcode    : '',
    			pageNo     : 1,
    			pageSize   : 1,
    			pageCount  : 0,
    			totalItems : 0
    	};
    	$scope.query = function(){
        	drawService.getDrawsByDate($scope.queryParam.dateBegin,
        			$scope.queryParam.dateEnd,
        			$scope.queryParam.barcode || '',
        			$scope.queryParam.pageSize,
        			$scope.queryParam.pageNo)
    		.then(function(receive){
    			var data = receive.data;
	    		if(data.status !== 0){
	    			throw new Error(data.errmsg);
	    		}
	    		$scope.draws = data.value.pageData;
	    		$scope.queryParam.pageCount = data.value.pageInfo.pageCount;
	    		$scope.queryParam.totalItems = data.value.pageInfo.totalRows;
	    		return $scope.draws;
    		})
    		.then(
    				function(draws){
		    			draws && draws.length>0 && draws.forEach(function(draw){
		    				drawService.getDrawDetailsByDrawId(draw.id)
		    					.success(function(data){
		    						if(data.status !== 0){
		    							return;
		    						}
		    						draw.drawDetails = data.value;
		    						angular.forEach(draw.drawDetails, function(drawDetail){
		    							recycleService.getRecycleById(drawDetail.recycleId)
		    								.then(
		    										function(recv){
		    											drawDetail.recycle = recv.data.value;    											
		    										}
		    								);
		    						});   						
		    						
		    					});
		    			});
		    		},
		    		function(err){
		    			$scope.msgs.push(err.message);
		    		}
    		);
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
    				.then(
    						function(recv){
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
		    					}else{
		    						throw new Error(data.errmsg);
		    					}
		    				}
    				)
    				.then(
	    					function(newDraw){
	    						if(!newDraw){
	    							return;
	    						}
    		    				drawService.getDrawDetailsByDrawId(newDraw.id)
    	    					.success(function(data){
    	    						newDraw.drawDetails = data.value;
    	    						angular.forEach(newDraw.drawDetails, function(detail){
            							recycleService.getRecycleById(detail.recycleId)
	        								.then(
	        										function(recv){
	        											detail.recycle = recv.data.value; 											
	        										}
	        								);
    	    						});
    	    					});
	    					},
	    					function(err){
	    						$scope.isSaveCompleted = true;
	    						$scope.msgs.push('修改失败！'+err.message);
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
	    					$scope.draws.splice(0, 0, data.value);
	    					$scope.isSaveCompleted = true;
	    					$scope.msgs.push('创建成功！');
	    					return data.value;
	    				}else{	    					
	    					throw new Error(data.errmsg);
	    				}
	    				
	    		})//从数据库加载保存成功后的Details记录
    			.then(
    					function(newDraw){
    						if(newDraw){
    		    				drawService.getDrawDetailsByDrawId(newDraw.id)
    	    					.success(function(data){
    	    						newDraw.drawDetails = data.value;
    	    						angular.forEach(newDraw.drawDetails, function(detail){
            							recycleService.getRecycleById(detail.recycleId)
	        								.then(
	        										function(recv){
	        											detail.recycle = recv.data.value; 											
	        										}
	        								);
    	    						});

    	    					});
    						}
    					},
    					function(err){
    						$scope.isSaveCompleted = true;
    						$scope.msgs.push('保存失败：'+err.message);
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
    		drawService.deleteDraw(cur.id)
    			.then(
	    			function(recv){
	    				var data = recv.data;
	    				if(data.status !== 0){
	    					throw new Error(data.errmsg);
	    				}
	    				$scope.draws.every(function(val,index){
		    					if(val == cur){
		    						$scope.currentedit={newval:{},oldval:{}};
		    						$scope.draws.splice(index,1);				
		    						$scope.IsHideModal = true;
		    						return false;
		    					}
		    					return true;
	    				});
	    				$scope.msgs.push('删除记录成功');
	    				
	    			}
	    		)
	    		.then(
	    				null,
	    				function(err){
		    				$scope.msgs.push('删除记录失败'+err.message);
		    				$scope.IsHideModal = true;
		    			}
	    		);
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
    	$scope.DRAW = {};
    	$scope.DRAW.isDrawDeletable = function(draw){
    		if(draw && draw.drawDetails && _.isArray(draw.drawDetails)){
        		var deletable=draw.drawDetails.every(function(drawDetail){
        			return _.isNull(drawDetail.recycleId);
        		});	
        		//console.log('可删除');
        		return deletable;
    		}
    		return false;
    	};
    	//下面是回收的操作
    	$scope.recycle = {};
    	$scope.recycle.isRecycleSaved = false;
    	$scope.recycle.msgs = [];
    	$scope.recycle.barcodeCollecter = '';
    	$scope.recycle.initRecycleModal = function(){
    		$scope.recycle.barcodeCollecter='';
    		$scope.recycle.recycleDetails=[];
    	};
    	$scope.recycle.initRecycleModal();
    	$scope.recycle.collectBarcode = function(event, barcode){
    		if(event.which === 13){
	    		if( !angular.isArray($scope.recycle.recycleDetails)){
	    			$scope.recycle.recycleDetails=[];
	    		}
	    		$scope.recycle.recycleDetails.push({'barcode':barcode, 'useFlag':0});
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
    		$scope.recycle.isRecycleSaved = false;
    		recycleService.createNewRecycle(
    				$scope.recycle.returner,
    				$scope.recycle.recycler,
    				$scope.recycle.remark,
    				$scope.recycle.recycleDetails
    				)
	    		.then(
	    				function(recv){
	    					if(recv.data.status !== 0){
	    						throw new Error(recv.data.errmsg);
	    					}
	    					var recycle = recv.data.value;
	    					$scope.recycle.isRecycleSaved = true;
	    					$scope.msgs.push('保存回收信息成功！');
	    	    			return recycle;//recycle对象		
	    				}

	    		)
	    		.then(
	    				function(recycle){        			 
	    					return recycleService.getRecycleDetails(recycle.id);    					
	    				}
	    		)
	    		.then(
	    				function(recv){
	    					//更新当前界面的数据
	    					var recycleDetails = recv.data.value;
	    					angular.forEach(recycleDetails, function(recycleDetail){
		        				$scope.draws.every(function(draw){
		        					var founded = draw.drawDetails.every(function(drawDetail){
		        						if(recycleDetail.id === drawDetail.id){
		        							drawDetail.useFlag = recycleDetail.useFlag;
		        							drawDetail.recycleId = recycleDetail.recycleId;
		        							recycleService.getRecycleById(drawDetail.recycleId)
			    								.then(
			    										function(recv){
			    											drawDetail.recycle = recv.data.value;    											
			    										}
			    								);
		        							return false;
		        						}
		        						return true;
			        				});
		        					return founded;
		        				});
	        				});
	    				},
	    				function(err){
	    					$scope.recycle.isRecycleSaved = true;
	    					$scope.recyle.msgs.push('保存失败：'+err.message);
	    				}

	    		);
    	};
    }]);
});
