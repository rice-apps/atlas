'use strict';

angular.module('mapApp', [])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'static/views/main.html',
				controller: 'MainCtrl'
			})
	});