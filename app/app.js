'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.home',
  'myApp.project',
  'myApp.donors',
  'myApp.donations',
  'myApp.about',
  'myApp.resources',
  'myApp.data',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
