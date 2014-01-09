  var map = this.map_leaflet = {};

  map.setup = function(center, zoom){
    console.log('center')
    console.log(center)
    console.log('zoom')
    console.log(zoom)
    this.map = L.map('map').setView(this.pointToLatLng(center), zoom);

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 4, maxZoom: 18, attribution: osmAttrib});
    osm.addTo(this.map);

    return map
  }

  map.setCenter = function(center){
    this.map.panTo(this.pointToLatLng(center))
  }

  map.pointToLatLng = function(point){
    return L.latLng(point.coordinates[1], point.coordinates[0])
  }

  map.makeMarker = function(point, title){
    var marker = L.marker(point)
    marker.addTo(this.map)
    return marker
  }