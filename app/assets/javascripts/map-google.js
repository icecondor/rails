  var map = this.map_google = {};

  map.setup = function(center, zoom){
    bounds = new google.maps.LatLngBounds();
    var mapOptions = {
      zoom: zoom,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    return map
  }
