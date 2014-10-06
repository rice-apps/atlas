'use strict';

/**
 * A utility class that obtains user location from browser and plots it on the 
 * map.
 */
angular.module('atlasApp').factory('LocationProvider', function($q) {
  /**
   * Instantiates a LocationProvider.
   * Parameters:
   *   map{google.maps.Map}: The map to plot user location on
   */
  function LocationProvider(map) {
    console.log("Location Provider instantiated");
    this._map = map;
  }

  LocationProvider.prototype = {

    getUserLocation: function() {
      // Use lazy instantiation to avoid asking the user for location permissions
      // if this function never gets called
      if (this._userLocation == null) {
        console.log("userLocation instantiated");
        this._userLocation = new GeolocationMarker();  // Asks browser for location
        this._userLocation.setMap(this._map);
      }
      return this._userLocation;
    },

    /**
     * Starts watching and panning to the user location.
     */
    startWatchingUserLocation: function() {
      var deferred = $q.defer();
      var self = this;
      if (!navigator.geolocation) {
        deferred.reject('Geolocation not supported.');
        return;   // Geolocation not supported
      }
      if (this._watchId != null) {
        deferred.reject('Already watching location.');
        return;   // Already watching
      }
      this._watchId = navigator.geolocation.watchPosition(function(position) {
        var coordinates = new google.maps.LatLng(
            position.coords.latitude, 
            position.coords.longitude);
        deferred.resolve(coordinates);
      }, function(error) {
        console.log(error);
        deferred.reject(error);
      }, this.getUserLocation().getPositionOptions());
      return deferred.promise;
    },

    /**
     * Stops watching the user location.
     */
    stopWatchingUserLocation: function() {
      if (this._watchId == null || !navigator.geolocation) {
        return;  // Not watching  / Geolocation not supported
      }
      navigator.geolocation.clearWatch(this._watchId);
      this._watchId = null;
    },

    /**
     * Displays the user location on the provided map
     */
    showUserLocation: function() {
      this.getUserLocation().setMarkerOptions({visible: true});
      this.getUserLocation().setCircleOptions({visible: true});
    },

    /**
     * Hides user location
     */
    hideUserLocation: function() {
      this.getUserLocation().setMarkerOptions({visible: false});
      this.getUserLocation().setCircleOptions({visible: false});
    }
  }

  return LocationProvider;
});