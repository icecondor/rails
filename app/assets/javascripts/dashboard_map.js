var map, bounds;
var tracked = {};
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
      tracked[data.username] = make_marker(data.position);
      $('#trackedlist').insert("<tr><td><img src='/images/gmaps/mm_20_red.png'></td><td><a href='/"+data.username+"'>"+data.username+"</a></td><td id='"+data.username+"-date'>"+data.date+"</td></tr>")
    }
  }
})

document.observe("dom:loaded",mapstart);
function mapstart() {
  bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    zoom: 14,
    center: bounds.getCenter(),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  map.fitBounds(bounds);

  add_fixed_users()
}

function add_user() {
   //make_marker({latitude: <%=ary.last.geom.y%>, longitude: <%=ary.last.geom.x%>})
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
