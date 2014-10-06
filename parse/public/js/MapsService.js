angular.module('atlasApp').service('MapsService', function(
	$scope, 
	$http
) {
	var MapsService = {};

	MapsService.mapCenter = new google.maps.LatLng(29.717384, -95.403171);

    /**
    * Initializes the Google Maps canvas
    */
    MapsService.initMap = function () {
	    console.log('Initializing');
	    var mapOptions = {
	      zoom: 15,
	      center: self.mapCenter,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      disableDefaultUI: true,
	    };

	    MapsService.mapCanvas = document.getElementById('map-canvas');

	    MapsService.map = new google.maps.Map(
	      mapCanvas,
	      mapOptions
	    );
    };

     MapsService.showMap = function() {
	    MapsService.mapCanvas.hidden = false;
	 };
	  
	 MapsService.hideMap = function() {
	    MapsService.mapCanvas.hidden = true;
	 };


    MapsService.plotMarker = function(lat, lng, name) {
	    var position = new google.maps.LatLng(lat, lng);

	    MapsService.marker = new google.maps.Marker({
	      position: position,
	      map: MapsService.map,
	      title: name
	    });

	    return position;
	};

	/**
	 * Resizes the view to fit within the bounds of the screen.
	 */
	MapsService.resizeView = function() {
		var newHeight = 
		$(window).height() 
			- $('div.navbar').height() 
			- 90
			- $('#toolbar').height();
		$('#map-canvas').css({height: newHeight});
	};


	MapsService.setCenter = function(position) {
	    MapsService.map.setCenter(position);
	};


	MapsService.clearMap = function() {};


	MapsService.getMap = function() {
		return MapsService.map;
	}


    return {
		initMap: MapsService.initMap,
	    showMap: MapsService.showMap,
	    hideMap: MapsService.hideMap,
	    plotMarker: MapsService.plotMarker,
	    setCenter: MapsService.setCenter,
	    getMap: MapsService.getMap
    };
});