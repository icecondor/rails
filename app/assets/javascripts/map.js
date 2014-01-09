var map = map_leaflet

function mapstart(center, zoom) {
  console.log(map_leaflet)
  map.setup(center, zoom)
}

function bounding_box(group) {
    points = []
    for(var username in group) {
      var locs = group[username].initial_locations
      if(locs.length > 0) {
        var loc = locs[locs.length-1]
        points.push([loc.position.latitude, loc.position.longitude]);
      }
    }

    var bounding_box = gju.boundingBoxAroundPolyCoords([points])
}

function pick_zoom(box){
  var corner_distance = gju.pointDistance(box[0], box[1])

  var zoom = 13;
  if(meters > 25000) { zoom = 5; }
  if(meters > 50000) { zoom = 4; }
  if(meters > 100000) { zoom = 3; }
  if(meters > 200000) { zoom = 2; }

  return [bounds.getCenter(),zoom];
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
    var locations = user.initial_locations;
    locations.forEach(function(location){update_position(location)})
  }
  //map.fitBounds(bounds);
}

function ic_connected() {
  $('.brand img').css('opacity', 1)
  setup_followers();
}

function setup_followers() {
  // following
  for(var username in group) {
    iceCondor.api({ type: 'follow', username: username});
  }

  iceCondor.on('location', dispatch)
}

function ic_disconnected() {
  $('.brand img').css('opacity', 0.4)
  console.log('disconnect!')
}

function dispatch(msg) {
  if(msg.type=="location") {
    update_position(msg)
  }
}

function update_position(msg) {
  var user = group[msg.username];

  if(newer_than_head(user.locations,msg)) {
    var new_point = new google.maps.LatLng(msg.position.latitude,
                                           msg.position.longitude);
    var marker = make_marker(user, new_point);
    msg.marker = marker
    marker.setTitle(msg.username)
    var speed = 0;

    if(user.locations.length > 0) {
      var last_location = user.locations[0]

      // determine speed
      speed = speed_calc(new Date(last_location.date),
                         last_location.marker.getPosition(),
                         new Date(msg.date),
                         marker.getPosition())
      // old positions get subtle marker
      var icon_name = msg.provider || "api"
      last_location.marker.setIcon(make_icon("/assets/mapmarkers/"+icon_name+".png"))

      // summary
      var accuracy = ""
      if(msg.position.accuracy) { accuracy = "acc "+
                                  Math.floor(last_location.position.accuracy)+"m"}
      var speed_str = Math.floor(speed)+" m/s"
      last_location.marker.setTitle(last_location.provider+" "+accuracy+" "+speed_str)
    }

    user.locations.unshift(msg);

    if (speed < 30) {
      user.line.getPath().push(new_point)
    } else {
      user.line.setPath([])
    }

    var localtime = new Date(msg.date);
    var words = short_date(localtime, new Date())
    $('#'+msg.username+'-date').html(words)
    $('#'+msg.username+'-date').attr("title",""+localtime)

  }
}

function newer_than_head(locations, location) {
  return date_position(locations.map(
                           function(user){return user.date}),
                       location.date) == 0
}

function date_position(dates, date) {
  var i=0;
  for(var len = dates.length; i < len; i++) {
    if(dates[i] < date) break
  }
  return i
}

function speed_calc(d1, ll1, d2, ll2) {
  var seconds = (d2-d1)/1000
  var meters = google.maps.geometry.spherical.computeDistanceBetween (ll1, ll2);
  return meters/seconds;
}

function add_user_ui(username) {
  var user = group[username];
  var fields = {
    UserName: username, TimeAgo: "", ImageUrl: user.marker_image_url
  };
  $('#trackedlist tbody').append($("#trackedUserTemplate").render(fields));
  $('#'+username+'-profile .profilelink').click(function(){center_on_username(username); return false})
  user.line = new google.maps.Polyline({map:map, strokeWeight: 1})
}

function center_on_username(username) {
  var user = group[username];
  var last_marker = user.locations[0].marker
  map.setCenter(last_marker.getPosition());
}

function make_marker(user, point) {
  var marker = new google.maps.Marker();
  marker.setMap(map);
  marker.setAnimation(google.maps.Animation.DROP);
  marker.setIcon(make_icon(user.marker_image_url));
  marker.setPosition(point);

  return marker;
}

function pick_icons() {
  var images = ["mm_20_yellow", "mm_20_blue", "mm_20_red", "mm_20_white",
                "mm_20_brown", "mm_20_lime", "mm_20_green"]
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
  var marker_image = new google.maps.MarkerImage(url);
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