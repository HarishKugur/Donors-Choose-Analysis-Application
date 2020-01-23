'use strict';

angular.module('myApp.home', ['ngRoute', 'myApp.data'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'home/home.html',
      controller: 'homeCtrl'
    });
  }])

  .controller('homeCtrl', function ($scope, dataService) {
    console.log("I am in home");

    $(document).ready(function () {
      $('.carousel').carousel({
        interval: 3000
      })
    });

    $scope.displayRowCount = function (request) {
      return dataService.getRowCount().then(function (response) {
        $scope.totalRows = response;
      }).catch(function (error) {
        console.log("Cannot get row count", error);
      })
    };

  });