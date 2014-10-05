angular.module('atlasApp').service('MapsService', function(
	$scope, 
	$http,
	LocationProvider,
	BusInfoProvider
) {
    return {
        /**
	    * Initializes the Google Maps canvas
	    */
	    initMap: function () {
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

		    // Instantiating the Bus Info Provider with a map.
		    $scope.busInfoProvider = new BusInfoProvider($scope.map);
	    };


	    plotMarker: function(lat, lng, name) {
		    var position = new google.maps.LatLng(lat, lng);

		    $scope.marker = new google.maps.Marker({
		      position: position,
		      map: $scope.map,
		      title: name
		    });
		    $scope.map.setCenter(position);
		};

		/**
		 * Resizes the view to fit within the bounds of the screen.
		 */
		resizeView: function() {
			var newHeight = 
			$(window).height() 
				- $('div.navbar').height() 
				- 90
				- $('#toolbar').height();
			$('#map-canvas').css({height: newHeight});
		};


		clearMap: function() {};

    };
});