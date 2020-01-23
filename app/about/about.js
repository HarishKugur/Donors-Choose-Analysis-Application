'use strict';

angular.module('myApp.about', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/about', {
    templateUrl: 'about/about.html',
    controller: 'AboutCtrl'
  });
}])

.controller('AboutCtrl', function($scope, $http) {
    console.log("I am in about View");

  //   $scope.displayRowCount = function (request) {
  //     $http({
  //         method: 'GET',
  //         url: 'http://localhost:3000/getRowCount'
  //     }).then(function success(response) {
  //         $scope.totalRows = response.data.rows[0][0];
  //     }).catch(function error(error) {
  //         console.log("Cannot get row count");
  //     });
  // };

});