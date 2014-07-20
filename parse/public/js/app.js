'use strict';

var atlasApp = angular.module('atlasApp', ['ngRoute', 'ui.bootstrap']);

atlasApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

atlasApp.run(function($rootScope) {
  var prod = true;
  if (prod) {
    Parse.initialize(
      "Hs7BvAGhMU9B4g757NZ0YAT0kOtxQ1hM78bQGu2y",
      "4jd4UMTQdExYgXgh40G7gppWnQgJB2mz7F3UE5ik"
    );
  } else {
    Parse.initialize(
      "FpiNAPH6LROJqpuYHyIG7X1xgQiLcGjECxWZU2ys",
      "dajAbPrS1zLC8bkvJQ77fXb6C7RfbYbu6uZbUb10"
    );
  }

});

console.log('Atlas App loaded.');