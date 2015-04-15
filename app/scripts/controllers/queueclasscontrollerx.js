define(['./module'],function(controllers,$){
    'use strict';
    controllers.controller('queueclass',
    		['$scope','$http','$timeout','queueClassService', 'externalSysService',
    		 function($scope,$http,$timeout, queueClassService, externalSysService){
		$scope.queueclasses = null;
		$scope.IsHideModal = true;
		$scope.msgs = [];
		$scope.mode = '';
		$scope.currentedit={newval:{},oldval:{}};
		$scope.isSaveCompleted = false;
		$scope.searchPinyin = {
				"py":"",
				"selectedItem" : {},
				"showColumns":["id","name"],
				"queryByPinyin":function(){
					return externalSysService.getExternalSysByPinyin($scope.searchPinyin.py);
				}
		};
		//dropdownlist for queue class mode
		$scope.ddlQueueClassMode = {
				menuItems:[{name:'简单', value:0},{name:'复杂', value:1}],
				showTopName:'name',
				showInMenuItemNames:['name'],
				selectedItem:null
		};
		$scope.$watch('currentedit.newval', function(){
			$scope.ddlQueueClassMode.selectedItem = $scope.ddlQueueClassMode.menuItems[$scope.currentedit.newval.mode || 0];
			$timeout(function(){
				$scope.searchPinyin.py = $scope.currentedit.newval.externalSysName || '';
				},600);
		});
		queueClassService.getAllQueueClasses().success(function(data){
			$scope.queueclasses = data.value;
		});
		$scope.saveChange = function(){
			$scope.isSaveCompleted = false;
			$scope.currentedit.newval.mode = $scope.ddlQueueClassMode.selectedItem.value;
			if ($scope.mode === 'edit'){
				queueClassService.saveChangeQueueClass($scope.currentedit.newval.id,
						$scope.currentedit.newval.name,
						$scope.currentedit.newval.mode,
						$scope.currentedit.newval.pinyin,
						$scope.searchPinyin.selectedItem.id)
					.success(function(data){
						if(data.status==0){
							$scope.currentedit.oldval.name = $scope.currentedit.newval.name;
							$scope.currentedit.oldval.mode = $scope.currentedit.newval.mode;
							$scope.currentedit.oldval.pinyin = $scope.currentedit.newval.pinyin;
							$scope.currentedit.oldval.externalSysId = $scope.searchPinyin.selectedItem.id;
							$scope.currentedit.oldval.externalSysName = $scope.searchPinyin.selectedItem.name;
							$scope.isSaveCompleted = true;
							$scope.msgs.push($scope.currentedit.newval.name+'修改成功！');
						}});
			}else if($scope.mode == 'create'){
				queueClassService.createNewQueueClass($scope.currentedit.newval.name,
						$scope.currentedit.newval.mode,
						$scope.currentedit.newval.pinyin,
						$scope.searchPinyin.selectedItem.id)
				.success(function(data){
					if(data.status==0){
						data.value.externalSysName = $scope.searchPinyin.selectedItem.name;
						$scope.queueclasses.push(data.value);
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
		$scope.translateQueueClassMode = function(mode){
			return (mode==0?'简单':(mode==1?'复杂':''));
		};
		$scope.deletecur = function(){
			var cur = $scope.currentedit.oldval;
			$scope.IsHideModal = false;
			queueClassService.delQueueClass(cur.id).success(function(data){
				if(data.status==0){
					angular.forEach( $scope.queueclasses, function(val,index){
						if(val == cur){
							$scope.currentedit={newval:{},oldval:{}};
							$scope.queueclasses.splice(index,1);						
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
