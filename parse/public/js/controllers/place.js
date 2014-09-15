'use strict';

angular.module('atlasApp').controller('PlaceCtrl', function(
  $location,
  $routeParams,
  $scope,
  $http,
  $q,
  cfpLoadingBar,
  LocationProvider
) {

  /**
   * The map center coordinates of Rice University.
   */
  $scope.mapCenter = new google.maps.LatLng(29.717384, -95.403171);

  $scope.Place = Parse.Object.extend('Place');

  // Used to determine whether the user location is turned on or not
  $scope.userLocationOn = false;

  // Used to display user location on the map, initiated along with map
  $scope.locationProvider = null;

  /**
   * Initalizes the Place controller.
   */
  $scope.init = function() {
    $scope.resizeView();
    $(window).resize($scope.resizeView);
    $scope.initMap();

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

  }

  /**
   * Initializes the Google Maps canvas
   */
  $scope.initMap = function () {
    console.log('Initializing');
    var mapOptions = {
      zoom: 15,
      center: $scope.mapCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };

    var mapCanvas = document.getElementById('map-canvas');

    $scope.map = new google.maps.Map(
      mapCanvas,
      mapOptions
    );

    $scope.locationProvider = new LocationProvider($scope.map);
  };

  $scope.plotPlace = function(place) {
    var position = new google.maps.LatLng(
      place.get('location').latitude,
      place.get('location').longitude
    );

    $scope.marker = new google.maps.Marker({
      position: position,
      map: $scope.map,
      title: place.get('name')
    });
    $scope.map.setCenter(position);
  };

  /**
   * Resizes the view to fit within the bounds of the screen.
   */
  $scope.resizeView = function() {
    var newHeight = 
      $(window).height() 
      - $('div.navbar').height() 
      - 90
      - $('#toolbar').height();
    $('#map-canvas').css({height: newHeight});
  };

  $scope.toggleUserLocation = function() {
    if ($scope.userLocationOn) {
      $scope.locationProvider.hideUserLocation();
      $scope.locationProvider.stopWatchingUserLocation();
    } else {
      $scope.locationProvider.showUserLocation();
      $scope.locationProvider.startWatchingUserLocation();
      var position = 
          $scope.locationProvider.getUserLocation().getPosition();
      if (position) {
        $scope.map.panTo(position);
      }
    }
    $scope.userLocationOn = !$scope.userLocationOn;
  }

  $scope.init();

});