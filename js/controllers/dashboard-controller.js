/**
 * 
 */
var dashboardApp = angular.module('dashboardApp', []);

dashboardApp.controller("colorCodingController", ['$scope', '$http', function($scope, $http){
	$scope.saveRule = function(){
		console.log("Saving rule");
	};
	
	$scope.discard = function(){
		console.log("Discarding rule");
		$("#rulesContainer").html("");
		$("#editModal").modal("hide");
	};
}]);


/*dashboardApp.directive("addbuttons", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			scope.count++;
			angular.element(document.getElementById('rulesContainer')).append($compile("<div><button class='btn btn-default' data-alert="+scope.count+">Show alert #"+scope.count+"</button></div>")(scope));
		});
	};
});*/



dashboardApp.directive("addNewRow", function($compile){	
	return function(scope, element, attrs){		
		element.bind("click", function(){			
			angular.element(document.getElementById('rulesContainer')).append(
					$compile('<div class="ruleRow"><button class="btn btn-primary btn-round" style="margin-bottom: 5px;" add-rule><span class="glyphicon glyphicon-plus"></span></button></div>')(scope));			
		});
		
	};
});

dashboardApp.directive("addRule", function($compile, $scope){
	return function(scope, element, attrs){
		element.bind("click", function(){
			console.log(element.parent());			
			angular.element(element.parent()).append($compile('<rule></rule>')(scope));			
		});
	};
});

dashboardApp.directive("rule", function(){
	return{
		restrict: "E",
		templateUrl: "templates/directives/rule.php",		
		controller: function(){
			console.log("Called");
		}
	};
	
});