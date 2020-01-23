'use strict';

angular.module('myApp.resources', ['ngRoute', 'myApp.data'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/resources', {
      templateUrl: 'resources/resources.html',
      controller: 'ResourcesCtrl'
    });
  }])

  .controller('ResourcesCtrl', function ($scope, $http, dataService) {
    console.log("I am in Resources View");

    var chartData = {
      chartID : '',
      labels : [],
      data : [],
      chartTitle : ' ',
      chartType : ' ',
      legendDisplay : false,
      isStacked :false,
      ruraldata : [],
      suburbandata : [],
      urbandata : []
    }

    var request = {}

    $scope.displayRowCount = function (request) {
      return dataService.getRowCount().then(function (response) {
        $scope.totalRows = response;
      }).catch(function (error) {
        console.log("Cannot get row count", error);
      })
    };

    $scope.getTechResources = function (param1, param2) {
       request.type = param1;

       $http({
        method: 'GET',
        url: 'http://localhost:3000/getTop10TechResources',
        headers: {
          'Content-Type': 'application/json'
         },
         json: request,
         params : request
       }).then(function success(response) {

          angular.forEach(response.data.rows, function (value, key) {
             chartData.labels.push(value[0]);
             chartData.ruraldata.push(value[1]);
             chartData.suburbandata.push(value[2]);
             chartData.urbandata.push(value[3]);
           });
           chartData.chartTitle = "Top 10 States in Technology Resource Consumption";
           chartData.label = "States";
           chartData.chartType = 'bar';
           chartData.legendDisplay = true;
           chartData.chartID = param2;
           drawHistogram();
           chartData = {
            labels : [],
            data : [],
            chartTitle : ' ',
            chartType : ' ',
            legendDisplay : false,
            isStacked :false,
            ruraldata : [],
            suburbandata : [],
            urbandata : []
          }
       
       }).catch(function error(error) {
         console.log("Cannot get top 10 states");
       });
      
    };

    $scope.getSuppliesResources = function (param1, param2) {
      request.type = param1

      $http({
       method: 'GET',
       url: 'http://localhost:3000/getTop10SuppliesResources',
       headers: {
         'Content-Type': 'application/json'
        },
        json: request,
        params : request
      }).then(function success(response) {
  
         angular.forEach(response.data.rows, function (value, key) {
            chartData.labels.push(value[0]);
            chartData.ruraldata.push(value[1]);
            chartData.suburbandata.push(value[2]);
            chartData.urbandata.push(value[3]);
          });
          chartData.chartTitle = "Top 10 States in Supplies Resource Consumption";
          chartData.label = "States";
          chartData.chartType = 'bar';
          chartData.legendDisplay = true;
          chartData.chartID= param2;
          drawHistogram();
          chartData = {
            labels : [],
            data : [],
            chartTitle : ' ',
            chartType : ' ',
            legendDisplay : false,
            isStacked :false,
            ruraldata : [],
            suburbandata : [],
            urbandata : []
          }
       

      }).catch(function error(error) {
        console.log("Cannot get top 10 states");
      });
     
   };

   $scope.getTopResourceNames = function (param1, param2){
     request.type = param1;
     $scope.topResourcestableData = [];

     $http({
       method: 'GET',
       url: 'http://localhost:3000/getTop5ResourceNames',
       headers: {
         'Content-Type': 'application/json'
        },
        json: request,
        params : request
     }).then(function success(response) {
       console.log(response.data);
       angular.forEach(response.data.rows, function(value, key){
          $scope.topResourcestableData.push(JSON.parse(response.data.rows[key]))
       });
       chartData = {
        labels : [],
        data : [],
        chartTitle : ' ',
        chartType : ' ',
        legendDisplay : false,
        isStacked :false,
        ruraldata : [],
        suburbandata : [],
        urbandata : []
      }

      }).catch(function error(error) {
        console.log("Cannot get top 5 resources");
      });
   };

    $scope.getBookResources = function (param1, param2) {
      request.type = param1;

      $http({
       method: 'GET',
       url: 'http://localhost:3000/getTop10BookResources',
       headers: {
         'Content-Type': 'application/json'
        },
        json: request,
        params : request
      }).then(function success(response) {
      
         angular.forEach(response.data.rows, function (value, key) {
            chartData.labels.push(value[0]);
            chartData.ruraldata.push(value[1]);
            chartData.suburbandata.push(value[2]);
            chartData.urbandata.push(value[3]);
          });
          chartData.chartTitle = "Top 10 States in Books Resource Consumption";
          chartData.label = "States";
          chartData.chartType = 'bar';
          chartData.legendDisplay = true;
          chartData.chartID = param2;
          drawHistogram();
          chartData = {
            labels : [],
            data : [],
            chartTitle : ' ',
            chartType : ' ',
            legendDisplay : false,
            isStacked :false,
            ruraldata : [],
            suburbandata : [],
            urbandata : []
          }
       
      

      }).catch(function error(error) {
        console.log("Cannot get top 10 states");
      });
     
   };

   $scope.getTypesResources = function (param1, param2) {
    request.type = param1;

    $http({
     method: 'GET',
     url: 'http://localhost:3000/getTopTypeResources',
     headers: {
       'Content-Type': 'application/json'
      },
      json: request,
      params : request
    }).then(function success(response) {
    
        angular.forEach(response.data.rows, function (value, key) {
          chartData.labels.push(value[0]);
          chartData.data.push(value[1]);
          });
        chartData.chartTitle = "Resource category distribution";
        chartData.label = "Category";
        chartData.chartType = 'pie';
        chartData.legendDisplay = true;
        chartData.chartID = param2;
        drawChart();
        chartData = {
         labels : [],
         data : [],
         chartTitle : ' ',
         chartType : ' ',
         legendDisplay : false,
         isStacked :false,
         ruraldata : [],
         suburbandata : [],
         urbandata : []
       }
     

    }).catch(function error(error) {
      console.log("Cannot get category");
    });
   
 };

   $scope.getPriceResources = function (param1, param2) {
    request.type = param1;

    $http({
     method: 'GET',
     url: 'http://localhost:3000/getTopPriceResources',
     headers: {
       'Content-Type': 'application/json'
      },
      json: request,
      params : request
    }).then(function success(response) {
    
        angular.forEach(response.data.metaData, function (value, key) {
          chartData.labels.push(value.name);
        });

        angular.forEach(response.data.rows[0], function (value, key) {
          chartData.data.push(value);
        });
        chartData.chartTitle = "Resource price request distribution range";
        chartData.label = "Price";
        chartData.chartType = 'pie';
        chartData.legendDisplay = true;
        chartData.chartID = param2;
        drawChart();
        chartData = {
         labels : [],
         data : [],
         chartTitle : ' ',
         chartType : ' ',
         legendDisplay : false,
         isStacked :false,
         ruraldata : [],
         suburbandata : [],
         urbandata : []
       }
    

    }).catch(function error(error) {
      console.log("Cannot get price");
    });
   
 };

   $scope.getVendorResources = function (param1, param2) {
    request.type = param1;

    $http({
     method: 'GET',
     url: 'http://localhost:3000/getVendorDistributionResources',
     headers: {
       'Content-Type': 'application/json'
      },
      json: request,
      params : request
    }).then(function success(response) {

       angular.forEach(response.data.rows, function (value, key) {
        chartData.labels.push(value[0]);
        chartData.data.push(value[1]);
        });
        chartData.chartTitle = "Vendor distribution for resources";
        chartData.label = "Vendor";
        chartData.chartType = 'doughnut';
        chartData.legendDisplay = true;
        chartData.chartID = param2;
        drawChart();
        chartData = {
         labels : [],
         data : [],
         chartTitle : ' ',
         chartType : ' ',
         legendDisplay : false,
         isStacked :false,
         ruraldata : [],
         suburbandata : [],
         urbandata : []
       }
     

    }).catch(function error(error) {
      console.log("Cannot get vendors");
    });
   
 };


    var drawChart = function () {
      let myChart = document.getElementById(chartData.chartID).getContext('2d');

      // Global Options
      Chart.defaults.global.defaultFontFamily = 'Lato';
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = '#777';

      let massPopChart = new Chart(myChart, {
        type: chartData.chartType, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: chartData.labels,
          
          datasets: [{
            label: chartData.label,
            data: chartData.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 374, 132, 0.6)',
              'rgba(45, 374, 135, 0.6)',
              'rgb(222, 113, 21)',
              'rgba(243, 6, 28, 0.82)',
              'rgb(241, 202, 10)',
              'rgb(16, 108, 247)',
              'rgba(233, 16, 247, 0.53)',
            ],
            borderWidth: 1,
            borderColor: '#777',
            hoverBorderWidth: 3,
            hoverBorderColor: '#000'
          }]
        },
        options: {
          title: {
            display: true,
            text: chartData.chartTitle,
            fontSize: 25
          },
          legend: {
            display: chartData.legendDisplay,
            position: 'right',
            labels: {
              fontColor: '#000'
            }
          },
          layout: {
            padding: {
              left: 50,
              right: 0,
              bottom: 0,
              top: 0
            }
          },
          tooltips: {
            enabled: true
          }
        }
      });
    }



    /*** Histogram */

    
    var drawHistogram = function () {
      let myChart = document.getElementById(chartData.chartID).getContext('2d');

      // Global Options
      Chart.defaults.global.defaultFontFamily = 'Lato';
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = '#777';

      let massPopChart = new Chart(myChart, {
        type: chartData.chartType, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Rural',
              data: chartData.ruraldata,
              backgroundColor: '#D6E9C6' // green
            },
            {
              label: 'Sub Urban',
              data: chartData.suburbandata,
              backgroundColor: '#FAEBCC' // yellow
            },
            {
              label: 'Urban',
              data: chartData.urbandata,
              backgroundColor: '#EBCCD1' // red
            }
          ]

        },
        options: {
          title: {
            display: true,
            text: chartData.chartTitle,
            fontSize: 25
          },
          legend: {
            display: chartData.legendDisplay,
            position: 'right',
            labels: {
              fontColor: '#000'
            }
          },
          layout: {
            padding: {
              left: 50,
              right: 0,
              bottom: 0,
              top: 0
            }
          },
          tooltips: {
            enabled: true
          },
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }]
          }
        }
      });
    }

  });