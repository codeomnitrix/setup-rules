/**
 * 
 */


//controller to get the campaigns from backend
angular.module("voluumApp").controller("campaignsController", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	var from = $routeParams.fromtime;
	var to = $routeParams.totime;
	var tz = $routeParams.tz;		
	console.log(from);
	console.log(to);
	console.log(tz);
	$scope.reverse = false;
	$scope.selectedCampaigns = [];
	$scope.promise = $http.get("voluumHandler.php?q=campaigns&from=" + from + "&to=" + to + "&tz=" + tz).success(function(response){		
		$scope.campaigns = response.rows;
		console.log(response.rows);		
	}).error(function(response){
		alert(response);
	});
					
	$scope.report = function() {
		
	    $scope.clicked = 'Campaign to be reported now';
	    console.log($scope.clicked);
	    return false;
	  };
	  
	  $scope.notes= function($event) {
		console.log($event);
	    $scope.clicked = 'notes to be displayed';
	    //check for the notes availability
	    
	    console.log($scope.clicked);
	    return false;
	  };
	  
	  $scope.flag = function(color) {
	    $scope.clicked = 'flag was clicked of ' + color;
	    console.log($scope.clicked);
	    return false;
	  };	  	  
		
	  /*
	   * Perform sorting on the clicked columns
	   */
	  $scope.changeSortOrder = function(order){
		  $scope.reverse = ($scope.orderByCol === order) ? !$scope.reverse : false;
	      $scope.orderByCol = order;		 
		  return false;
	  };	
}]);
