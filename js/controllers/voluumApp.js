var voluumApp = angular.module("voluumApp", ["ngRoute", "cgBusy", "angularUtils.directives.dirPagination", "bp-ngContextMenu", "angularjs-dropdown-multiselect", 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);

voluumApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.when("/campaigns/:fromtime/:totime/:tz*", {
		controller: "campaignsController",
		templateUrl: "templates/campaigns-template.php" 
	}).when("/traffic-sources/filter/:traffic/:customvars/:fromtime/:totime/:tz*", {
		controller: "subCampaignsController",
		templateUrl: "templates/sub-campaigns-template.php"
	}).when("/traffic-sources/:fromtime/:totime/:tz*", {
		controller: "trafficController",
		templateUrl: "templates/traffic-template.php" 
	}).when("/offers/:fromtime/:totime/:tz*",{
		controller: "offersController",
		templateUrl: "templates/offers-template.php" 
	}).when("/landers/:fromtime/:totime/:tz*", {
		controller: "landersController",
		templateUrl: "templates/landers-template.php" 
	}).when("/", {
		controller: "dummyController",
		templateUrl: "templates/welcome-template.php"
	}).otherwise({redirectTo: "/"});
}]);


voluumApp.controller("offersController", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	var from = $routeParams.fromtime;
	var to = $routeParams.totime;
	var tz = $routeParams.tz;
	console.log(from);
	console.log(to);
	console.log(tz);
	$scope.promise = $http.get("voluumHandler.php?q=offer&from=" + from + "&to=" + to + "&tz=" + tz).success(function(response){		
		$scope.campaigns = response.rows;
		console.log(response.rows);
	}).error(function(response){
		alert(response);
	});
	
	  /*
	   * Perform sorting on the clicked columns
	   */
	  $scope.changeSortOrder = function(order){
		  $scope.orderByCol = order;
		  console.log(order);
		  return false;
	  };	
}]);

voluumApp.controller("landersController", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	var from = $routeParams.fromtime;
	var to = $routeParams.totime;
	var tz = $routeParams.tz;
	console.log(from);
	console.log(to);
	console.log(tz);
	$scope.promise = $http.get("voluumHandler.php?q=lander&from=" + from + "&to=" + to + "&tz=" + tz).success(function(response){		
		$scope.campaigns = response.rows;
		console.log(response.rows);
	}).error(function(response){
		alert(response);
	});
	 /*
	   * Perform sorting on the clicked columns
	   */
	  $scope.changeSortOrder = function(order){
		  $scope.orderByCol = order;
		  console.log(order);
		  return false;
	  };	
}]);

voluumApp.controller("trafficController", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	var from = $routeParams.fromtime;
	var to = $routeParams.totime;
	var tz = $routeParams.tz;
	console.log(from);
	console.log(to);
	console.log(tz);
	$scope.promise = $http.get("voluumHandler.php?q=traffic&from=" + from + "&to=" + to + "&tz=" + tz).success(function(response){		
		$scope.campaigns = response.rows;
		console.log(response.rows);
	}).error(function(response){
		alert(response);
	});
	
	$scope.reportTrafficSources = function(item){
		var tsID = angular.element(item.currentTarget).data()["id"];
		var customVars = angular.element(item.currentTarget).data()["customvars"];
		//url = /traffic-sources/filter/:traffic/:fromtime/:totime/:tz*
		var from = $routeParams.fromtime;
		var to = $routeParams.totime;
		var tz = $routeParams.tz;
		var url = "#/traffic-sources/filter/" + tsID + "/" + customVars + "/" + from + "/" + to + "/" + tz;
		console.log(url);
		$scope.changeRoute(url, false);
	};
	
	
	$scope.changeRoute = function(url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };   
      /*
	   * Perform sorting on the clicked columns
	   */
	  $scope.changeSortOrder = function(order){
		  $scope.orderByCol = order;
		  console.log(order);
		  return false;
	  };	
}]);













//display campaigns specific to the filter
voluumApp.controller("subCampaignsController", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	var traffic = $routeParams.traffic;
	var customVars = $routeParams.customvars.split(","); 
	var from = $routeParams.fromtime;
	var to = $routeParams.totime;
	var tz = $routeParams.tz;
	$scope.isWaiting = true;
	$scope.selectMessage = "Select All";
	console.log(from);
	console.log(to);
	console.log(tz);		
	console.log(traffic);
	$scope.selectedCampaigns = [];
	var i = 0;
	$scope.filters = [{"label": "ROI", "value": "ROI"}, {"label": "Profit", "value": "Profit"}, {"label": "Revenue", "value": "Revenue"}, 
	                  {"label": "Cost", "value": "Cost"}, {"label": "Visits", "value": "Visits"}, {"label": "Clicks", "value": "Clicks"}];
	$scope.operators = ["<", "<=", ">", ">="]
	//populating default variables
	var tempOutVars = ['browser', 'browser-version', 'os', 'os-version', 'device', 'brand', 'model', 'lander', 'offer'];
	var outVars = [];
	for (var i = 0; i < tempOutVars.length; i++) {
		var tVar = tempOutVars[i];
		outVars.push({
			"id": tVar,
			"label": tVar
		});
	}
	//selected custom vars will be populated in customVarsModel
	$scope.selectedCustomVars = [];
	for(i=0;i<customVars.length;i++){		
		if(customVars[i] != ""){
			outVars.push({"id": "custom-variable-" + (i+1), 
						  "label": customVars[i]});			
		}
	}
	
	$scope.customVars = outVars;
	
	$scope.customVarsSettings = {enableSearch: true};
	console.log($scope.customVars);
	
	/*console.log("voluumHandler.php?q=campaigns&traffic=" + traffic + "&from=" + from + "&to=" + to + "&tz=" + tz);
	return false;*/
	$scope.promise = $http.get("voluumHandler.php?q=campaigns&filter=traffic-source&filterVal=" + traffic + "&from=" + from + "&to=" + to + "&tz=" + tz).success(function(response){		
		$scope.campaigns = response.rows;
		console.log(response.rows);
		$scope.isWaiting = false;
	}).error(function(response){
		alert(response);
		$scope.isWaiting = false;
	});
	
	//toggle one select on click
	$scope.toggleSelect = function(item){					
		var campID = angular.element(item.currentTarget).data()["id"];
		console.log(campID);
		var ind = $scope.selectedCampaigns.indexOf(campID);
		if(ind > -1){
			//clearing one option so just make select all text active
			$scope.selectMessage = "Select All";
			$scope.selectedCampaigns.splice(ind, 1);
		}else{
			$scope.selectedCampaigns.push(campID);
			console.log($scope.selectedCampaigns);
		}		
	};
	
	//Select all or clear all functionality
	$scope.selectAll = function(){
		if($scope.selectedCampaigns.length != $scope.campaigns.length){
			$scope.selectedCampaigns = [];
			var i;
			for(i = 0;i<$scope.campaigns.length;i++){
				$scope.selectedCampaigns.push($scope.campaigns[i].campaignId);
			}
			$scope.selectMessage = "Clear All";
		}else{
			$scope.selectMessage = "Select All";
			$scope.selectedCampaigns = [];
		}				
	};
	
	//there will be one function to download the reports which will be called recursively after success of 
	//all the current requests.
	var tempCampaignList = [];
	$scope.reportSelected = function(){
		//in visible filters I have all the filter data
		//download the files one by one and process the filters
		console.log($scope.selectedCustomVars);
		var selectedCustomVarArray = [];
		for (var i = 0; i < $scope.selectedCustomVars.length; i++) {
			var temp = $scope.selectedCustomVars[i];
			selectedCustomVarArray.push(temp.id);			
		}				
		var filterTypeArray = [];
		var operatorTypeArray = [];
		var inputAArray = [];
		var inputBArray = [];
		for (var i = 0; i < $scope.visibleFilters.length; i++) {
			var eltId = $scope.visibleFilters[i];
			var filterType = $scope.filterNum[eltId];			
			filterTypeArray.push(filterType);
			var operatorType = $scope.operatorNum[eltId];
			operatorTypeArray.push(operatorType);
			var inputAVal = $scope.inputANum[eltId];
			inputAArray.push(parseFloat(inputAVal));
			var inputBVal = $scope.inputBNum[eltId];
			inputBArray.push(inputBVal);
		}
		
		console.log(filterTypeArray);
		console.log(operatorTypeArray);
		console.log(inputAArray);
		console.log(inputBArray);
		
		Voluum.setFrom();
		Voluum.setTo();
		Voluum.setTZ();
		Voluum.setFilterType(filterTypeArray);
		Voluum.setOperatorType(operatorTypeArray);
		Voluum.setInputAVal(inputAArray);
		Voluum.setInputBVal(inputBArray);
		console.log($scope.selectedCampaigns);				
		Voluum.getReportsRec($scope.selectedCampaigns, selectedCustomVarArray, selectedCustomVarArray, Voluum.from, Voluum.to, Voluum.tz);
		
		//get all the files one by one
		//apply filters 
		//show them to user for download
		//thats it

		
	};
	
	
	//ng-repeat ng-model names in filters 
	$scope.filterNum = {0: 'ROI', 1: 'Cost', 2: '', 3: '', 4: '', 5: '',
	                    6: '', 7: '', 8: '', 9: '', 10: '', 11: '',
	                    12: '', 13: '', 14: '', 15: '', 16: '', 17: ''};
	
	$scope.operatorNum = {0: '<', 1: '<', 2: '', 3: '', 4: '', 5: '',
	                    6: '', 7: '', 8: '', 9: '', 10: '', 11: '',
	                    12: '', 13: '', 14: '', 15: '', 16: '', 17: ''};
	
	$scope.inputANum = {0: '', 1: '2.5', 2: '', 3: '', 4: '', 5: '',
            6: '', 7: '', 8: '', 9: '', 10: '', 11: '',
            12: '', 13: '', 14: '', 15: '', 16: '', 17: ''};
	$scope.inputBNum = {0: '', 1: '', 2: '', 3: '', 4: '', 5: '',
            6: '', 7: '', 8: '', 9: '', 10: '', 11: '',
            12: '', 13: '', 14: '', 15: '', 16: '', 17: ''};
	
	$scope.getNumber = function(num) {
        return new Array(num);   
    };
    
    $scope.visibleFilters = [0, 1];
    
    $scope.addFilter = function(){
    	var i = 0;
    	for(i=0;i<18;i++){
    		if($scope.visibleFilters.indexOf(i) == -1){
    			$scope.visibleFilters.push(i);
    			break;
    		}
    	}
    	if(i == 18){
    		alert("Are you nuts! How many filters do you want");
    	}
    };
    
    $scope.removeFilter = function(item){
    	var id = angular.element(item.currentTarget).data()["id"];
    	var ind = $scope.visibleFilters.indexOf(id);
    	if(ind != -1){
    		$scope.visibleFilters.splice(ind, 1);
    	}
    };
    
    
	
}]);

voluumApp.controller("dummyController", ['$scope', function($scope){
	
	//move this code to display of campaigns on click on a campaign
	
	
	
}]);

voluumApp.controller("activateController", ['$scope', '$location', function($scope, $location){
	//set the thing to active
	$scope.isActive = function(subPath){		
		if($location.path().indexOf(subPath)>-1){
			return true;
		}else{
			return false;
		}
	};
}]);


//populate default values configuration parameters
voluumApp.controller("timezoneController", ['$scope', '$route', '$routeParams', '$location', function($scope, $route, $routeParams, $location){
	//refresh the page
	$scope.refreshPage = function(){
		url = "#" + $location.path();		
		url = url.split("\"")[0];
		console.log($scope.fromDate);
		var d = $scope.fromDate;
		var d = $scope.fromDate;
		d = "\"" + d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + 
				d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds()  + ".000Z\"";	
		var d1 = $scope.toDate;
		d1 = "\"" + d1.getUTCFullYear() + "-" + (d1.getUTCMonth() + 1) + "-" + d1.getUTCDate() + "T" + 
		d1.getUTCHours() + ":" + d1.getUTCMinutes() + ":" + d1.getUTCSeconds()  + ".000Z\"";
		url = url + d + "/" + d1 + "/" + $scope.tz.value;		
		console.log(url);		
		$scope.changeRoute(url);		
	}
	
	$scope.changeRoute = function(url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };    
    console.log($location.path());
    var today = new Date();
	$scope.fromDate = new Date(); 
	$scope.fromDate.setDate(today.getDate()-1); 
	$scope.toDate = new Date();	
    
    $scope.open = {
    	    fromDate: false,
    	    toDate: false    	    
    };
	//show calendar
    $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
    };
    
	
	$scope.timezones = [
	                    {"value": "Etc/GMT+12", "text": "(UTC-12:00) International Date Line West"},
	                    {"value": "Etc/GMT+11", "text": "(UTC-11:00) Coordinated Universal Time-11"},
	                    {"value": "Pacific/Honolulu", "text": "(UTC-10:00) Hawaii"},
	                    {"value": "America/Anchorage", "text": "(UTC-09:00) Alaska"},
	                    {"value": "America/Santa_Isabel", "text": "(UTC-08:00) Baja California"},
	                    {"value": "America/Los_Angeles", "text": "(UTC-08:00) Pacific Time (US & Canada)"},
	                    {"value": "America/Phoenix", "text": "(UTC-07:00) Arizona"},
	                    {"value": "America/Chihuahua", "text": "(UTC-07:00) Chihuahua, La Paz, Mazatlan"},
	                    {"value": "America/Denver", "text": "(UTC-07:00) Mountain Time (US & Canada)"},
	                    {"value": "America/Guatemala", "text": "(UTC-06:00) Central America"},
	                    {"value": "America/Chicago", "text": "(UTC-06:00) Central Time (US & Canada)"},
	                    {"value": "America/Mexico_City", "text": "(UTC-06:00) Guadalajara, Mexico City, Monterrey"},
	                    {"value": "America/Regina", "text": "(UTC-06:00) Saskatchewan"},
	                    {"value": "America/Bogota", "text": "(UTC-05:00) Bogota, Lima, Quito"},
	                    {"value": "America/New_York", "text": "(UTC-05:00) Eastern Time (US & Canada)"},
	                    {"value": "America/Indianapolis", "text": "(UTC-05:00) Indiana (East)"},
	                    {"value": "America/Asuncion", "text": "(UTC-04:00) Asuncion"},
	                    {"value": "America/Halifax", "text": "(UTC-04:00) Atlantic Time (Canada)"},
	                    {"value": "America/Cuiaba", "text": "(UTC-04:00) Cuiaba"},
	                    {"value": "America/La_Paz", "text": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan"},
	                    {"value": "America/Santiago", "text": "(UTC-04:00) Santiago"},
	                    {"value": "America/Sao_Paulo", "text": "(UTC-03:00) Brasilia"},
	                    {"value": "America/Buenos_Aires", "text": "(UTC-03:00) Buenos Aires"},
	                    {"value": "America/Cayenne", "text": "(UTC-03:00) Cayenne, Fortaleza"},
	                    {"value": "America/Godthab", "text": "(UTC-03:00) Greenland"},
	                    {"value": "America/Montevideo", "text": "(UTC-03:00) Montevideo"},
	                    {"value": "America/Bahia", "text": "(UTC-03:00) Salvador"},
	                    {"value": "Etc/GMT+2", "text": "(UTC-02:00) Coordinated Universal Time-02"},
	                    {"value": "Atlantic/Azores", "text": "(UTC-01:00) Azores"},
	                    {"value": "Atlantic/Cape_Verde", "text": "(UTC-01:00) Cape Verde Is."},
	                    {"value": "Africa/Casablanca", "text": "(UTC) Casablanca"},
	                    {"value": "Etc/GMT", "text": "(UTC) Coordinated Universal Time"},
	                    {"value": "Europe/London", "text": "(UTC) Dublin, Edinburgh, Lisbon, London"},
	                    {"value": "Atlantic/Reykjavik", "text": "(UTC) Monrovia, Reykjavik"},
	                    {"value": "Europe/Berlin", "text": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"},
	                    {"value": "Europe/Budapest", "text": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"},
	                    {"value": "Europe/Paris", "text": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris"},
	                    {"value": "Europe/Warsaw", "text": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb"},
	                    {"value": "Africa/Lagos", "text": "(UTC+01:00) West Central Africa"},
	                    {"value": "Africa/Windhoek", "text": "(UTC+01:00) Windhoek"},
	                    {"value": "Asia/Amman", "text": "(UTC+02:00) Amman"},
	                    {"value": "Europe/Bucharest", "text": "(UTC+02:00) Athens, Bucharest"},
	                    {"value": "Asia/Beirut", "text": "(UTC+02:00) Beirut"},
	                    {"value": "Africa/Cairo", "text": "(UTC+02:00) Cairo"},
	                    {"value": "Asia/Damascus", "text": "(UTC+02:00) Damascus"},
	                    {"value": "Africa/Johannesburg", "text": "(UTC+02:00) Harare, Pretoria"},
	                    {"value": "Europe/Kiev", "text": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"},
	                    {"value": "Europe/Istanbul", "text": "(UTC+02:00) Istanbul"},
	                    {"value": "Asia/Jerusalem", "text": "(UTC+02:00) Jerusalem"},
	                    {"value": "Asia/Nicosia", "text": "(UTC+02:00) Nicosia"},
	                    {"value": "Asia/Baghdad", "text": "(UTC+03:00) Baghdad"},
	                    {"value": "Europe/Kaliningrad", "text": "(UTC+03:00) Kaliningrad, Minsk"},
	                    {"value": "Asia/Riyadh", "text": "(UTC+03:00) Kuwait, Riyadh"},
	                    {"value": "Africa/Nairobi", "text": "(UTC+03:00) Nairobi"},
	                    {"value": "Asia/Dubai", "text": "(UTC+04:00) Abu Dhabi, Muscat"},
	                    {"value": "Asia/Baku", "text": "(UTC+04:00) Baku"},
	                    {"value": "Europe/Moscow", "text": "(UTC+04:00) Moscow, St. Petersburg, Volgograd"},
	                    {"value": "Indian/Mauritius", "text": "(UTC+04:00) Port Louis"},
	                    {"value": "Asia/Tbilisi", "text": "(UTC+04:00) Tbilisi"},
	                    {"value": "Asia/Yerevan", "text": "(UTC+04:00) Yerevan"},
	                    {"value": "Asia/Karachi", "text": "(UTC+05:00) Islamabad, Karachi"},
	                    {"value": "Asia/Tashkent", "text": "(UTC+05:00) Tashkent"},
	                    {"value": "Asia/Almaty", "text": "(UTC+06:00) Astana"},
	                    {"value": "Asia/Dhaka", "text": "(UTC+06:00) Dhaka"},
	                    {"value": "Asia/Yekaterinburg", "text": "(UTC+06:00) Ekaterinburg"},
	                    {"value": "Asia/Bangkok", "text": "(UTC+07:00) Bangkok, Hanoi, Jakarta"},
	                    {"value": "Asia/Novosibirsk", "text": "(UTC+07:00) Novosibirsk"},
	                    {"value": "Asia/Shanghai", "text": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi"},
	                    {"value": "Asia/Krasnoyarsk", "text": "(UTC+08:00) Krasnoyarsk"},
	                    {"value": "Asia/Singapore" , "text": "(UTC+08:00) Kuala Lumpur, Singapore" , "selected": "selected"},
	                    {"value": "Australia/Perth", "text": "(UTC+08:00) Perth"},
	                    {"value": "Asia/Taipei", "text": "(UTC+08:00) Taipei"},
	                    {"value": "Asia/Ulaanbaatar", "text": "(UTC+08:00) Ulaanbaatar"},
	                    {"value": "Asia/Irkutsk", "text": "(UTC+09:00) Irkutsk"},
	                    {"value": "Asia/Tokyo", "text": "(UTC+09:00) Osaka, Sapporo, Tokyo"},
	                    {"value": "Asia/Seoul", "text": "(UTC+09:00) Seoul"},
	                    {"value": "Australia/Brisbane", "text": "(UTC+10:00) Brisbane"},
	                    {"value": "Australia/Sydney", "text": "(UTC+10:00) Canberra, Melbourne, Sydney"},
	                    {"value": "Pacific/Port_Moresby", "text": "(UTC+10:00) Guam, Port Moresby"},
	                    {"value": "Australia/Hobart", "text": "(UTC+10:00) Hobart"},
	                    {"value": "Asia/Yakutsk", "text": "(UTC+10:00) Yakutsk"},
	                    {"value": "Pacific/Guadalcanal", "text": "(UTC+11:00) Solomon Is., New Caledonia"},
	                    {"value": "Asia/Vladivostok", "text": "(UTC+11:00) Vladivostok"},
	                    {"value": "Pacific/Auckland", "text": "(UTC+12:00) Auckland, Wellington"},
	                    {"value": "Etc/GMT-12", "text": "(UTC+12:00) Coordinated Universal Time+12"},
	                    {"value": "Pacific/Fiji", "text": "(UTC+12:00) Fiji"},
	                    {"value": "Asia/Magadan", "text": "(UTC+12:00) Magadan"},
	                    {"value": "Pacific/Tongatapu", "text": "(UTC+13:00) Nuku'alofa"},
	                    {"value": "Pacific/Apia", "text": "(UTC+13:00) Samoa"}
	                  ];
}]);