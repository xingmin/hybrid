'use strict';
angular.module('app')
.controller('welcomectrl',['$scope',function($scope){
		$scope.username = 'test'
	}])
.controller('registerctrl',['$scope','$http', '$location', 'md5',
	                       function($scope,$http,$location, md5){
	$scope.formData= {usersex:1}	
	$scope.submitRegister=function(isValid){
		
		if (!isValid) {
			$scope.submitInvalid = true;
			return;
		}
		$scope.submitInvalid = false;
		$scope.formData.introducerpwd = md5.createHash($scope.formData.introducerpwd || '');
		console.log($scope.introducerpwd);
		$http.post('/users/register', $scope.formData)	
			.success(function(data){
				console.log(data);				
				if(data.status==1){
					$location.path('register/success')
				}else{
					$scope.status= data.status;
					$scope.errorinfo=[];
					$scope.errorinfo.push(data.msg);
				}
			});
		
	};
	
	$scope.menuItmes= [];
	$scope.dropDownDeptsMenu = function(val){
		$http.get('/depts/getdeptlist/'+val)
			.success(function(data){
				console.log(data);
				$scope.menuItmes = data;
		});
	};
	$scope.selectMenuItem = function(index){
		$scope.formData.userdept = $scope.menuItmes[index].name;
		$scope.formData.userdeptid = $scope.menuItmes[index].id;
	};
	
	$scope.$watch('formData.introducerpwd', function(){		
		console.log(md5.createHash($scope.formData.introducerpwd || ''));
		});
}]);


