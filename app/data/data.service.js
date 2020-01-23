
'use strict';

  angular.module('myApp.data', [])

    .factory('dataService', dataService);

    dataService.$inject = ['$http'];
    function dataService($http) { 

        var service = {
            getRowCount: getRowCount,
          };
          return service;

          function getRowCount() {
           return $http({
                method: 'GET',
                url: 'http://localhost:3000/getRowCount'
            }).then(function success(response) {
                return response.data.rows[0][0];
            }).catch(function error(error) {
                return error;
            });
          }

    }

