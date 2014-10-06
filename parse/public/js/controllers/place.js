'use strict';

angular.module('atlasApp').controller('PlaceCtrl', function(
  $location,
  $routeParams,
  $scope,
  $http,
  $q,
  $timeout,
  cfpLoadingBar,
  LocationProvider,
  BusInfoProvider,
  MapsService
) {

  /**
   * The map center coordinates of Rice University.
   */

  $scope.Place = Parse.Object.extend('Place');

  // Used to determine whether the user location is turned on or not
  $scope.userLocationOn = false;

  $scope.userLocationLoading = false;

  // Used to display user location on the map, initiated along with map
  $scope.locationProvider = null;

  // This tells us if the user wants to see the bus info
  $scope.busInfoOn = false;

  $scope.busInfoLoading = false;

  $scope.busInfoProvider = null;

  $scope.refreshThemBuses = null;

  /**
   * Initalizes the Place controller.
   */
  $scope.init = function() {

    MapsService.initMap();
    $(window).resize(function() {
      var newHeight = 
      $(window).height() 
        - $('div.navbar').height() 
        - 90
        - $('#toolbar').height();
      MapsService.setMapHeight(newHeight);
    });

    // Fetch the place from Parse
    var placeID = $routeParams.placeID
    if (placeID) {
      var query = new Parse.Query($scope.Place);
      query.get(placeID).then(function(place) {
        console.log(place);
        window.place = place;
        $scope.place = place;
        $scope.$apply();
        $('title').text('Atlas - ' + place.get('name'));
        $scope.plotPlace(place);
      }, function(error) {
        alert("Error: " + error.message);
        console.log(error);
      });
    }

    $scope.locationProvider = new LocationProvider(MapsService.getMap());

    // Instantiating the Bus Info Provider with a map.
    $scope.busInfoProvider = new BusInfoProvider(MapsService.getMap());

  }

 

  $scope.plotPlace = function(place) {
    MapsService.plotMarker(
      place.get('location').latitude,
      place.get('location').longitude,
      place.get('name')
    );
  };


  $scope.toggleUserLocation = function() {
    if ($scope.userLocationOn) {
      $scope.locationProvider.hideUserLocation();
      $scope.locationProvider.stopWatchingUserLocation();
      $scope.userLocationOn = false;
      return;
    } 

    $scope.userLocationLoading = true;

    var position =
        $scope.locationProvider.getUserLocation().getPosition();
    if (position) {
      $timeout(function() {
        MapsService.getMap().panTo(position);
        $scope.userLocationLoading = false;
        $scope.userLocationOn = true;
        $scope.locationProvider.showUserLocation();
      }, 1000);
    } else {
      $scope.locationProvider.startWatchingUserLocation()
          .then(function(coordinates) {
            $scope.userLocationLoading = false;
            $scope.userLocationOn = true;
            MapsService.getMap().panTo(coordinates);
          });
    }
  };

  $scope.toggleBusLocation = function() {
    if ($scope.busInfoOn) {
      $timeout.cancel($scope.getBusInfo);
      $scope.busInfoProvider.stopDrawingBusInfo();
      $scope.busInfoOn = false;
    } else {
      $scope.busInfoLoading = true;
      $scope.getBusInfo = $timeout(function myFunction() {
        $http.get('http://rice-buses.herokuapp.com').success(function (data) {
          $scope.busInfoLoading = false;
          $scope.busInfoOn = true;
          $scope.busInfoProvider.refreshBuses(data.d);
          $scope.getBusInfo = $timeout(myFunction, 2000);
        }, 2000);
      });
    }
  };

  $scope.init();

});