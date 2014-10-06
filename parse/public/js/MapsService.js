angular.module('atlasApp').service('MapsService', function(
	$scope, 
	$http
) {
    return {

    	var self = this;
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

		    self.map = new google.maps.Map(
		      mapCanvas,
		      mapOptions
		    );
	    };


	    plotMarker: function(lat, lng, name) {
		    var position = new google.maps.LatLng(lat, lng);

		    self.marker = new google.maps.Marker({
		      position: position,
		      map: $scope.map,
		      title: name
		    });
		    self.map.setCenter(position);
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