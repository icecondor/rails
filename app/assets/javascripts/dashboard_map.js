var map, bounds;
var tracked = {};

$(function() {
    mapstart();
    play_initial_locations();
    iostart();
  });

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

function play_initial_locations() {
  console.log("playback of initial locations")
  initial_locations.forEach(function(location) {
    update_position(location)
  })
  map.fitBounds(bounds);
}

function iostart() {
  console.log("iostart")
  var socketio = io.connect();

  // following
  socketio.emit('following', { type: 'follow', username: 'iss' });
  initial_locations.forEach(function(location) {
    socketio.emit('following', { type: 'follow', username: location.username});
  })

  socketio.on('update', dispatch)
}

function dispatch(msg) {
  if(msg.type=="location") {
    update_position(msg)
  }
}

function update_position(msg) {
  if(tracked[msg.username]) {
    var point = new google.maps.LatLng(msg.position.latitude, 
                                       msg.position.longitude);
    tracked[msg.username].setPosition(point);
    $('#'+msg.username+'-date').html(msg.date)
  } else {
    add_user(msg.username, msg)
  }
}

function add_user(username, initial_location) {
  var user = users[username];
  tracked[username] = make_marker(initial_location.position, user.profile_image_url);
  var fields = {
    MarkerImage:"none", UserName: username, TimeAgo: initial_location.date,
    ImageUrl: user.profile_image_url
  };
  $('#trackedlist').append($("#trackedUserTemplate").render(fields));
}

function make_marker(position, image) {
  var point = new google.maps.LatLng(position.latitude, 
                                     position.longitude);
  var marker_image = new google.maps.MarkerImage(image, 15);
  var marker = new google.maps.Marker();
  marker.setPosition(point);
  marker.setMap(map);
  //marker.setIcon(marker_image);
  bounds.extend(point);
  return marker;
}
