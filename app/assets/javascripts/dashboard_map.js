var map, bounds;
var tracked = {};

$(mapstart);
$(initial_tracked)
$(iostart);

function iostart() {
  var socketio = io.connect();
  socketio.emit('following', { type: 'follow', username: 'iss' });

  //socketio.emit('following', { type: 'follow', username: '<%=ary.last.user.username%>' });

  socketio.on('update', function(data) {
    console.log(data)
    if(data.type=="location") {
      if(tracked[data.username]) {
        var point = new google.maps.LatLng(data.position.latitude, 
                                           data.position.longitude);
        tracked[data.username].setPosition(point);
        $('#'+data.username+'-date').update(data.date)
      } else {
        add_user(data.username, data.position)
      }
    }
  })
}

function initial_tracked() {
  initial_tracked.forEach(function(location) {
    add_user(location.username, location.position)
  })
}

function mapstart() {
  bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    zoom: 14,
    center: bounds.getCenter(),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  map.fitBounds(bounds);
}

function add_user(username, initial_position) {
  tracked[username] = make_marker(initial_position);
  $('#trackedlist').append($("#trackedUserTemplate").render({
    MarkerImage:"none", UserName: username, TimeAgo: "long"
  }));
}

function make_marker(position) {
  var point = new google.maps.LatLng(position.latitude, 
                                     position.longitude);
  var marker = new google.maps.Marker();
  marker.setPosition(point);
  marker.setMap(map);
  bounds.extend(point);
  map.fitBounds(bounds)
  return marker;
}
