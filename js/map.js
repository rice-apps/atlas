var map;
function initialize() {
  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(29.718204, -95.400000),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);