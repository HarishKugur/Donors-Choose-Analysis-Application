'use strict';

angular.module('myApp.login', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'login/login.html',
      controller: 'loginCtrl'
    });
  }])

  .controller('loginCtrl', function ($scope, $http, $location) {
    console.log('This is Donors Choose Homepage');

    $scope.loginSuccessful = true

    $http({
      method: 'GET',
      url: 'http://localhost:3000/logindata/'
    }).then(function success(response) {
      $scope.loginInfo = response.data;
    }).catch(function error(error) {
      console.log('Login Data Service', error)
    });

    $scope.authenticateLogin = function (request) {
      $http({
        method: 'POST',
        url: 'http://localhost:3000/authenticateLogin',
        headers: {
          'Content-Type': 'application/json'
        },
        params: request
      }).then(function success(response) {
        if (response.data.loginStatus === "Success") {
          $scope.loginSuccessful = true;
          $location.path('/home');
        }
        else {
          $scope.loginSuccessful = false;
        }
      }).catch(function error(error) {
        console.log('Authenicate Login Service Failed', error)
      });
    }

  });