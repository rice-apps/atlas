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

  $scope.userLocation = null;

  $scope.userLocationOn = false;


  /**
   * Initalizes the Place controller.
   */
  $scope.init = function() {
    $scope.resizeView();
    $(window).resize($scope.resizeView);
    $scope.initMap();
    /*$scope.geoMarker = new GeolocationMarker($scope.map);*/

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
      - 90;
    $('#map-canvas').css({height: newHeight});
  };

  /**
   *Makes user able to choose if to show the current location or not
   */

  $scope.toggleUserLocation = function($event){
    if ($scope.userLocation == null && ! $scope.userLocationOn){
      $scope.userLocation = new GeolocationMarker($scope.map);
      $scope.userLocation.setCircleOptions({visible:false});
      $event.target.text = "Hide My Location";
      $scope.userLocationOn = true;
    }
    else{
      if ($scope.userLocationOn){
        $scope.userLocationOn = false;
        $event.target.text = "Show My Location";
        $scope.userLocation.setMarkerOptions({visible:false});
      }
      else{
        $scope.userLocationOn = true;
        $event.target.text = "Hide My Location";
        $scope.userLocation.setMarkerOptions({visible:true});
      }
    }
  }
  $scope.init();

});