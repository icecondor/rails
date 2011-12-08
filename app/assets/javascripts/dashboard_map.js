var map, bounds;

$(function() {
    mapstart();
    define_group_ui();
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

function define_group_ui() {
  console.log("creating users")
  for(var username in group) {
    add_user_ui(username)
  }
}

function play_initial_locations() {
  console.log("playing initial locations")
  initial_locations.forEach(function(location) {
    update_position(location)
  })
  map.fitBounds(bounds);
}

function iostart() {
  console.log("iostart")
  var socketio = io.connect();

  // following
  for(var username in group) {
    socketio.emit('following', { type: 'follow', username: location.username});
  }

  socketio.on('update', dispatch)
}

function dispatch(msg) {
  if(msg.type=="location") {
    update_position(msg)
  }
}

function update_position(msg) {
  var marker = group[msg.username].marker;
  var new_point = new google.maps.LatLng(msg.position.latitude, 
                                         msg.position.longitude);
  marker.setPosition(new_point);
  $('#'+msg.username+'-date').html(msg.date)
  bounds.extend(new_point);
}

function add_user_ui(username) {
  var user = group[username];
  user.marker = make_marker();
  var fields = {
    UserName: username, TimeAgo: "", ImageUrl: user.profile_image_url
  };
  $('#trackedlist').append($("#trackedUserTemplate").render(fields));
}

function make_marker() {
  var marker = new google.maps.Marker();
  marker.setMap(map);
  return marker;
}
