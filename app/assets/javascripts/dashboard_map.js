var map, bounds;

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
  for(var username in group) {
    var user = group[username];
    var locations = user.locations;
    locations.forEach(function(location){update_position(location)})
  }
  //map.fitBounds(bounds);
}

function setup_followers() {
  // following
  for(var username in group) {
    iceCondor.api({ type: 'follow', username: username});
  }

  iceCondor.on('location', dispatch)
}

function disconnect() {
  console.log('disconnect!')
}

function dispatch(msg) {
  if(msg.type=="location") {
    update_position(msg)
  }
}

function update_position(msg) {
  var user = group[msg.username];
  var marker = make_marker();
  user.last_marker = marker;
  marker.setIcon(make_icon(user.marker_image_url));
  if(user.markers.length > 0) {
    var icon_name = msg.provider
    if((icon_name === null) || (typeof(icon_name) == "undefined")) {
      icon_name = "api"
    }
    user.markers[user.markers.length-1].setIcon(make_icon("/assets/mapmarkers/"+icon_name+".png"))
  }
  user.markers.push(marker);
  var new_point = new google.maps.LatLng(msg.position.latitude, 
                                         msg.position.longitude);
  marker.setPosition(new_point);
  var localtime = new Date(msg.date);
  var words = short_date(localtime, new Date())
  $('#'+msg.username+'-date').html(words)
  $('#'+msg.username+'-date').attr("title",""+localtime)
  
  user.line.getPath().push(new_point)
}

function add_user_ui(username) {
  var user = group[username];
  var fields = {
    UserName: username, TimeAgo: "", ImageUrl: user.marker_image_url
  };
  $('#trackedlist').append($("#trackedUserTemplate").render(fields));
  $('#'+username+'-link').click(function(){center_on_username(username); return false})
  user.line = new google.maps.Polyline({map:map, strokeWeight: 1})
}

function center_on_username(username) {
  map.setCenter(group[username].last_marker.getPosition());
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
    var user = group[usernames[i]]
    user.marker_image_url = marker_icon_for(user, images[i]+".png")
  }
}

function marker_icon_for(user, default_filename) {
  var marker_name = user.marker_image_filename
  if((marker_name === null) || (typeof marker_name == "undefined")) {
    marker_name = default_filename;
  }
  return "/assets/mapmarkers/"+marker_name
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

function short_date(then, now) {
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    var hours = then.getHours(), 
        minutes = then.getMinutes(),
        ampm = "am";
    if (hours >= 12) {
      ampm = "pm"
    }
    if (hours > 12) {
      hours = hours-12;
    }
    /*if (hours < 10) {
      hours = "0"+hours
    }*/
    if(minutes < 10) {
      minutes = "0"+minutes
    }

    if ((now-then) > (1000*60*60*24)) {
      return monthNames[then.getMonth()]+" "+then.getDate()
    } else {
      return hours+":"+minutes+ampm
    }
}

function ago(then, now) {
  var seconds = (now - then)/1000;
  var quantity, unit;
  if(seconds < 60) {
    unit = "seconds";
    quantity = seconds
  } else if (seconds < (60*60)) {
    unit = "mins"
    quantity = seconds/60
  } else  {
    quantity = seconds/(60*60)
    unit = "hours"
  }
  var rounded_quantity = Math.floor(quantity*10)/10
  return ""+rounded_quantity+" "+unit;
}