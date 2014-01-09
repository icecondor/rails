  var map = this.map_leaflet = {};

  map.setup = function(center, zoom){
    var map = L.map('map').setView(center, zoom);

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 4, maxZoom: 18, attribution: osmAttrib});
    osm.addTo(map);

    return map
  }