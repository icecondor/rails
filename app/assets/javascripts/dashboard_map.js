var map, bounds;
var tracked = {};

$(function() {
    mapstart();
    setup_initial_tracked();
    iostart();
  });

function iostart() {
  console.log("iostart")
  var socketio = io.connect();

  // following
  socketio.emit('following', { type: 'follow', username: 'iss' });
  initial_tracked.forEach(function(location) {
    socketio.emit('following', { type: 'follow', username: location.username});
  })

  socketio.on('update', function(data) {
    if(data.type=="location") {
      if(tracked[data.username]) {
        var point = new google.maps.LatLng(data.position.latitude, 
                                           data.position.longitude);
        tracked[data.username].setPosition(point);
        $('#'+data.username+'-date').html(data.date)
        console.log('position update for '+data.username+' '+data.date)
      } else {
        add_user(data.username, data.position)
      }
    }
  })
}

function setup_initial_tracked() {
  console.log("setup initial tracked")
  initial_tracked.forEach(function(location) {
    add_user(location.username, location)
  })
  map.fitBounds(bounds);
}

function mapstart() {
  console.log("mapstart")
  bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    zoom: 14,
    center: bounds.getCenter(),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function add_user(username, initial_location) {
  tracked[username] = make_marker(initial_location.position);
  var fields = {
    MarkerImage:"none", UserName: username, TimeAgo: initial_location.date
  };
  $('#trackedlist').append($("#trackedUserTemplate").render(fields));
}

function make_marker(position) {
  var point = new google.maps.LatLng(position.latitude, 
                                     position.longitude);
  var marker = new google.maps.Marker();
  marker.setPosition(point);
  marker.setMap(map);
  bounds.extend(point);
  return marker;
}
