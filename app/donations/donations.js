'use strict';

angular.module('myApp.donations', ['ngRoute', 'myApp.data'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/donations', {
      templateUrl: 'donations/donations.html',
      controller: 'DonationsCtrl'
    });
  }])

  .controller('DonationsCtrl', function ($scope, $http, dataService) {
    console.log("I am in donations View");

    var chartData = {
      chartID: '',
      labels : [],
      data : [],
      chartTitle : '',
      chartType : 'bar',
      legendDisplay : false,
      xAxisLabel : '',
      firstData : [],
      secondData : [],
      thirdData : [],
      fourthData: []
    }

    var request = {}

    $scope.getTop10Donations = function (param1, param2) {
      request.type = param1;
    

      $http({
        method: 'GET',
        url: 'http://localhost:3000/getTop10StatesByDonor',
        headers: {
          'Content-Type': 'application/json'
        },
        json: request,
        params: request
      }).then(function success(response) {
        
          angular.forEach(response.data.rows, function (value, key) {
            chartData.labels.push(value[0]);
            chartData.data.push(value[1]);
          });

          chartData.chartID = param2;
          chartData.chartType = "horizontalBar"
          chartData.chartTitle = 'Top 10 States by Donor Count';
          chartData.xAxisLabel = 'Donor Count';

          drawChart();
          chartData = {
            chartID: '',
            labels : [],
            data : [],
            chartTitle : '',
            chartType : 'bar',
            legendDisplay : false,
            xAxisLabel : '',
            firstData : [],
            secondData : [],
            thirdData : [],
            fourthData: []
          }
        
       

      }).catch(function error(error) {
        console.log("Cannot get top 10 donations");
      });
    };

    /**Top 10 States with Highest Donations - map data */

    $scope.getStatesHighestDonations = function (param1) {
      request.type = param1;
      $scope.tableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getStatesHighestDonations',
        headers: {
          'Content-Type': 'application/json'
        },
        params : request
      }).then(function success(response) {
        drawMap(response.data.rows);
      }).catch(function error(error) {
        console.log("Cannot get top 10 highest donations", error);
      });
      
    };

    /**getStatesHighestDonationsAsTable */

    $scope.getStatesHighestDonationsAsTable = function () {
      $scope.highestDonatedStatesTableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getStatesHighestDonationsAsTable',
        headers: {
          'Content-Type': 'application/json'
        },
        params : request
      }).then(function success(response) {
        angular.forEach(response.data.rows, function(value, key) {
          $scope.highestDonatedStatesTableData.push(JSON.parse(response.data.rows[key]))
      });
      }).catch(function error(error) {
        console.log("Cannot get top 10 highest donations", error);
      });
      
    };

    /** Correlation between Donations and Free Lunch Schools */
    $scope.getFreeLunchPercentage = function (param1, param2) {
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getFreeLunchPercentage',
        headers: {
          'Content-Type': 'application/json'
        },
        params : request
      }).then(function success(response) {

        angular.forEach(response.data.rows, function (value, key) {
          chartData.labels.push(value[0]);
          chartData.firstData.push(value[1]);
          chartData.secondData.push(value[2]);
          chartData.thirdData.push(value[3]);
          chartData.fourthData.push(value[4]);
        });

        chartData.chartID = param2;
        chartData.chartTitle = 'Correlation Between Donations and Free lunch Schools over months';
        chartData.xAxisLabel = 'Months';
        chartData.chartType = 'line';

        drawStackedLineChart();
        chartData = {
          chartID: '',
          labels : [],
          data : [],
          chartTitle : '',
          chartType : 'bar',
          legendDisplay : false,
          xAxisLabel : '',
          firstData : [],
          secondData : [],
          thirdData : [],
          fourthData: []
        }
      }).catch(function error(error) {
        console.log("Cannot get correlation for free lunch school percentage", error);
      });

    };


    $scope.displayRowCount = function (request) {
      return dataService.getRowCount().then(function (response) {
        $scope.totalRows = response;
      }).catch(function (error) {
        console.log("Cannot get row count", error);
      })
    };

    var drawStackedLineChart = function () {
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
              label: '0 - 25 (%)',
              data: chartData.firstData,
              backgroundColor: 'rgb(255, 99, 132)' // red
            },
            {
              label: '25 - 50 (%)',
              data: chartData.secondData,
              backgroundColor: 'rgb(54, 162, 235)' // blue
            },
            {
              label: '50 - 75 (%)',
              data: chartData.thirdData,
              backgroundColor: 'rgb(75, 192, 192)' // green
            },
            {
              label: '75 - 100 (%)',
              data: chartData.fourthData,
              backgroundColor: 'rgb(255, 205, 86)' // red
            }
          ]

        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: chartData.chartTitle
          },
          tooltips: {
            mode: 'index',
          },
          hover: {
            mode: 'index'
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: chartData.xAxisLabel
              }
            }],
            yAxes: [{
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'Value'
              }
            }]
          }
        }
      });
    }


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
            label: chartData.xAxisLabel,
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


    var drawMap = function (inputData) {
      var map = L.map('map').setView([38.01, -95.84], 4);

      // load a tile layer
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
      }).addTo(map);


      angular.forEach(inputData, function (value, key) {
        var jsonValue = JSON.parse(value);
        L.marker([jsonValue.Latitude, jsonValue.Longitude]).bindTooltip(jsonValue.State,
          {
            permanent: true,
            direction: 'right'
          }
        ).addTo(map);

      });
    }
  });