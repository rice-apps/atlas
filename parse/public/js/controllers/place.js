'use strict';

angular.module('atlasApp').controller('PlaceCtrl', function(
  $location,
  $routeParams,
  $scope,
  $http,
  $q,
  cfpLoadingBar
) {

  /**
   * The map center coordinates of Rice University.
   */
  $scope.mapCenter = new google.maps.LatLng(29.717384, -95.403171);

  $scope.Place = Parse.Object.extend('Place');

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
      }, function(error) {
        alert("Error: " + error.message);
        console.log(error);
      });
    }

    // Plot user location on the map
    var userMarker = new google.maps.Marker({
      clickable: false,
      icon: '/img/user-location-marker.png',
      shadow: null,
      zIndex: 999,
      map: $scope.map
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var userLoc = new google.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        console.log("User Location: ");
        console.log(userLoc);
        userMarker.setPosition(userLoc);
      }, function(error) {
        console.log('Error getting user location: ' + error);
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
  };

  $scope.plotPlace = function(place) {

  };

  /**
   * Resizes the view to fit within the bounds of the screen.
   */
  $scope.resizeView = function() {
    $('body').css({height: $(window).height() - $('div.navbar').height() - 10})
  };

  $scope.init();

});