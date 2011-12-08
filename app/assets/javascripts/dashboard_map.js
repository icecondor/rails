var map, bounds;

$(function() {
    mapstart();
    define_group_ui();
    play_initial_locations();
    iostart();
  });

function mapstart() {
  console.log("googlemap start")
  bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(45.519,-122.69),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function define_group_ui() {
  console.log("creating users")
  pick_icons();
  for(var username in group) {
    add_user_ui(username)
  }
}

function play_initial_locations() {
  console.log("playing initial locations")
  initial_locations.forEach(function(location) {
    update_position(location)
  })
  //map.fitBounds(bounds);
}

function iostart() {
  console.log("socketio start")
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
  user.marker.setIcon(make_icon(user.marker_image_url));
  var fields = {
    UserName: username, TimeAgo: "", ImageUrl: user.marker_image_url
  };
  $('#trackedlist').append($("#trackedUserTemplate").render(fields));
}

function make_marker() {
  var marker = new google.maps.Marker();
  marker.setMap(map);
  marker.setAnimation(google.maps.Animation.DROP);
  return marker;
}

function pick_icons() {
  var images = ["yellow", "blue", "green", "red", "orange", "purple"]
  //var images = ["mm_20_yellow", "mm_20_blue", "mm_20_white"]
  var usernames = []
  for(var username in group) {usernames.push(username)};
  for(var i=0,len=usernames.length; i < len; i++) {
    group[usernames[i]].marker_image_url = "/assets/mapmarkers/"+images[i]+".png"
  }
}

function make_icon(url) {
  var size = new google.maps.Size(32,32)
  var scaled_size = new google.maps.Size(20,20)
  var marker_image = new google.maps.MarkerImage(url, size, null, null, scaled_size);
  return marker_image
}

function str_to_idx(str, count) {
  var num = 1;
  for(var i=0,len=str.length; i < len; i++) {
    num = num * str.charCodeAt(i)
  }
  return num % count
}