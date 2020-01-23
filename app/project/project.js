'use strict';

angular.module('myApp.project', ['ngRoute', 'myApp.data'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/project', {
      templateUrl: 'project/project.html',
      controller: 'ProjectCtrl'
    });
  }])

  .controller('ProjectCtrl', function ($scope, $http, dataService) {
    console.log("I am in Project View");

    var chartData = {
      chartID: '',
      labels: [],
      data: [],
      chartTitle: '',
      chartType: 'bar',
      legendDisplay: false,
      xAxisLabel: ''
    }

    var request = {}

    $scope.displayRowCount = function (request) {
      return dataService.getRowCount().then(function (response) {
        $scope.totalRows = response;
      }).catch(function (error) {
        console.log("Cannot get row count", error);
      })
    };

    $scope.getTop10Donations = function (param1, param2) {
      request.type = param1;
      $scope.tableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getTop10Donations',
        headers: {
          'Content-Type': 'application/json'
        },
        json: request,
        params: request
      }).then(function success(response) {
        if (request.type === 'chart') {
          angular.forEach(response.data.rows, function (value, key) {
            chartData.labels.push(value[0]);
            chartData.data.push(value[1]);
          });

          chartData.chartID = param2;
          chartData.chartType = "horizontalBar"
          chartData.chartTitle = 'Projects with Top 10 Donations';
          chartData.xAxisLabel = 'Projects';

          drawChart();
          chartData = {
            chartID: '',
            labels: [],
            data: [],
            chartTitle: '',
            chartType: 'bar',
            legendDisplay: false,
            xAxisLabel: ''
          }
        }
        else {
          console.log(response.data);
          angular.forEach(response.data.rows, function (value, key) {
            $scope.tableData.push(JSON.parse(response.data.rows[key]))
          });
        }

      }).catch(function error(error) {
        console.log("Cannot get top 10 donations");
      });
    };

    //Most expired projects based on category
    $scope.getExpiredProjects = function (param1, param2) {
      request.type = param1;
      $scope.tableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getExpiredProjects',
        headers: {
          'Content-Type': 'application/json'
        },
        params: request
      }).then(function success(response) {
        if (request.type === 'chart') {
          angular.forEach(response.data.rows, function (value, key) {
            chartData.labels.push(value[0]);
            chartData.data.push(value[1]);
          });

          chartData.chartID = param2;
          chartData.chartTitle = 'Most Expired Projects Based on Resource Category';
          chartData.chartType = 'horizontalBar';
          chartData.xAxisLabel = 'Count';
          drawChart();
          chartData = {
            chartID: '',
            labels: [],
            data: [],
            chartTitle: '',
            chartType: 'bar',
            legendDisplay: false,
            xAxisLabel: ''
          }
        }
        else {
          console.log(response.data);
          angular.forEach(response.data.rows, function (value, key) {
            $scope.tableData.push(JSON.parse(response.data.rows[key]))
          });
        }

      }).catch(function error(error) {
        console.log("Cannot get Category-wise Expired Projects");
      });
    };

    //Most expired projects state-wise
    $scope.getExpiredProjectsPerState = function (param1, param2) {
      request.type = param1;
      $scope.tableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getExpiredProjectsPerState',
        headers: {
          'Content-Type': 'application/json'
        },
        params: request
      }).then(function success(response) {
        if (request.type === 'chart') {
          angular.forEach(response.data.rows, function (value, key) {
            chartData.labels.push(value[0]);
            chartData.data.push(value[1]);
          });

          chartData.chartID = param2;
          chartData.chartTitle = 'Top 10 States with highest ratio of Expired Projects to Fully-Funded Projects';
          chartData.chartType = 'horizontalBar';
          chartData.xAxisLabel = 'Count';
          drawChart();
          chartData = {
            chartID: '',
            labels: [],
            data: [],
            chartTitle: '',
            chartType: 'bar',
            legendDisplay: false,
            xAxisLabel: ''
          }
        }
        else {
          console.log(response.data);
          angular.forEach(response.data.rows, function (value, key) {
            $scope.tableData.push(JSON.parse(response.data.rows[key]))
          });
        }

      }).catch(function error(error) {
        console.log("Cannot get State-wise Expired Projects");
      });
    };

    //Correlation Chart
    $scope.getCorrelationChart = function (param1, param2) {
      request.type = param1;
      $scope.tableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getCorrelationChart',
        headers: {
          'Content-Type': 'application/json'
        },
        params: request
      }).then(function success(response) {
        if (request.type === 'chart') {
          angular.forEach(response.data.rows, function (value, key) {
            // chartData.labels.push(value[0]);
            chartData.data.push({ x: value[1], y: value[1] });
          });

          chartData.chartID = param2;
          chartData.chartTitle = 'Correlation Between Speed of Donation vs Length of Project Need Statement';
          chartData.chartType = 'scatter';
          chartData.xAxisLabel = 'Correlation Factor';
          drawChart();
          chartData = {
            chartID: '',
            labels: [],
            data: [],
            chartTitle: '',
            chartType: 'bar',
            legendDisplay: false,
            xAxisLabel: ''
          }
        }
        else {
          console.log(response.data);
          angular.forEach(response.data.rows, function (value, key) {
            $scope.tableData.push(JSON.parse(response.data.rows[key]))
          });
        }

      }).catch(function error(error) {
        console.log("Cannot get Correlation Graph");
      });
    };

    //Month-wise Donation Distribution
    $scope.getDonationDistribution = function (param1, param2) {
      request.type = param1;
      $scope.tableData = [];
      $http({
        method: 'GET',
        url: 'http://localhost:3000/getDonationDistribution',
        headers: {
          'Content-Type': 'application/json'
        },
        params: request
      }).then(function success(response) {
        if (request.type === 'chart') {
          angular.forEach(response.data.rows, function (value, key) {
            chartData.labels.push(value[0]);
            chartData.data.push(value[1]);
          });
          var allMonths = ['January  ', 'February ', 'March    ', 'April    ', 'May      ', 'June     ', 'July     ', 'August   ',
            'September', 'October  ', 'November ', 'December '];

          chartData.labels.sort(function (a, b) {
            return allMonths.indexOf(a) - allMonths.indexOf(b);

          });

          chartData.chartID = param2;
          chartData.chartTitle = 'Month-wise Donation Distribution';
          chartData.chartType = 'line';
          chartData.xAxisLabel = 'Amount';

          drawChart();
          chartData = {
            chartID: '',
            labels: [],
            data: [],
            chartTitle: '',
            chartType: 'bar',
            legendDisplay: false,
            xAxisLabel: ''
          }
        }
        else {
          console.log(response.data);
          angular.forEach(response.data.rows, function (value, key) {
            $scope.tableData.push(JSON.parse(response.data.rows[key]))
          });
        }

      }).catch(function error(error) {
        console.log("Cannot get monthly donation distribution");
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

  });