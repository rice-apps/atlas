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
  Parse.initialize(
    "FpiNAPH6LROJqpuYHyIG7X1xgQiLcGjECxWZU2ys",
    "dajAbPrS1zLC8bkvJQ77fXb6C7RfbYbu6uZbUb10"
  );

});

console.log('Atlas App loaded.');