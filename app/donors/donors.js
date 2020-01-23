'use strict';

angular.module('myApp.donors', ['ngRoute', 'myApp.data'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/donors', {
      templateUrl: 'donors/donors.html',
      controller: 'DonorsCtrl'
    });
  }])

  .controller('DonorsCtrl', function ($scope, $http, dataService) {
    console.log("I am in donors View");

    var chartData = {
      chartID : '',
      labels : [],
      data : [],
      chartTitle : '',
      chartType : 'bar',
      legendDisplay : false,
      firstData : [],
      secondData : [],
    }

    var request = {}

    $scope.displayRowCount = function (request) {
      return dataService.getRowCount().then(function (response) {
        $scope.totalRows = response;
      }).catch(function (error) {
        console.log("Cannot get row count", error);
      })
    };

    $scope.getStateWise = function (param1, param2) {
      // request.type = param2;
      var chartType = param2;
  
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getStateWise',
        headers: {
          'Content-Type': 'application/json'
        },
        json: request,
        params : request
      }).then(function success(response) {
      
        angular.forEach(response.data.rows, function (value, key) {
          value = JSON.parse(value);
          chartData.labels.push(value.State);
          chartData.firstData.push(value.TotalAmountForSame);
          chartData.secondData.push(value.TotalAmountForDifferent);
        });
        
          chartData.chartTitle = "Total Amount donated to same state vs different state";
          chartData.chartID = param1;
          chartData.label = "States";
          chartData.chartType = 'line';
          drawLineChart();

          chartData = {
            chartID : '',
            labels : [],
            chartTitle : '',
            chartType : 'line',
            legendDisplay : false,
            firstData : [],
            secondData : [],
          }

      }).catch(function error(error) {
        console.log("Cannot get state wise donations");
      });
      
    
    };

    $scope.getPointsOfDonors = function (type) {
      request.type = type;
      $scope.pointsTableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getPointsOfDonors',
        headers: {
          'Content-Type': 'application/json'
        },
        params : request
      }).then(function success(response) {

          console.log(response.data);
          angular.forEach(response.data.rows, function(value, key) {
              $scope.pointsTableData.push(JSON.parse(response.data.rows[key]))
          });
        

      }).catch(function error(error) {
        console.log("Cannot get top 10 donations");
      });

    };

    $scope.getNumOfProjects = function () {
      $scope.numOfTimes = 0;
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getNumOfProjects',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(function success(response) {
        
          console.log(response.data);
          $scope.numOfTimes = response.data.rows[0][0];
      }).catch(function error(error) {
        console.log("Cannot get top 10 donations");
      });

    };

    var drawLineChart = function () {
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
              label: 'Total Donated amount to same states',
              fill: false,
              data: chartData.firstData,
              backgroundColor: 'rgb(255, 99, 132)' // red
            },
            {
              label: 'Total Donated amount to different states',
              fill: false,
              data: chartData.secondData,
              backgroundColor: 'rgb(54, 162, 235)' // blue
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
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'States'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Total Donation Amount ($)'
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
          labels: ['Georgia', 'Florida'],
          // datasets: [{
          //   label: chartData.label,
          //   data: chartData.data,
          //   backgroundColor: [
          //     'rgba(255, 99, 132, 0.6)',
          //     'rgba(54, 162, 235, 0.6)',
          //     'rgba(255, 206, 86, 0.6)',
          //     'rgba(75, 192, 192, 0.6)',
          //     'rgba(153, 102, 255, 0.6)',
          //     'rgba(255, 159, 64, 0.6)',
          //     'rgba(255, 99, 132, 0.6)',
          //     'rgba(255, 374, 132, 0.6)',
          //     'rgba(45, 374, 135, 0.6)',
          //     'rgb(222, 113, 21)',
          //     'rgba(243, 6, 28, 0.82)',
          //     'rgb(241, 202, 10)',
          //     'rgb(16, 108, 247)',
          //     'rgba(233, 16, 247, 0.53)',
          //   ],
          //   borderWidth: 1,
          //   borderColor: '#777',
          //   hoverBorderWidth: 3,
          //   hoverBorderColor: '#000'
          // }]
          datasets: [
            {
              label: 'Rural',
              data: [2, 2],
              backgroundColor: '#D6E9C6' // green
            },
            {
              label: 'Sub Urban',
              data: [26, 52],
              backgroundColor: '#FAEBCC' // yellow
            },
            {
              label: 'Urban',
              data: [24, 24],
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