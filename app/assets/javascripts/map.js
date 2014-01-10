var map = this.map_leaflet

function mapstart(center, zoom) {
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
  return {coordinates:[[bounding_box[0], [], bounding_box[1], []]]}
}

function pick_zoom(box){
  var sw_point = {coordinates: box.coordinates[0][0]}
  var ne_point = {coordinates: box.coordinates[0][2]}
  var meters = gju.pointDistance(sw_point, ne_point)

  var zoom = 16;
  if(meters > 25000) { zoom = 8; }
  if(meters > 50000) { zoom = 7; }
  if(meters > 100000) { zoom = 6; }
  if(meters > 200000) { zoom = 5; }

  return zoom
}

function define_group_ui() {
  console.log("creating users "+Object.keys(group))
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
    console.log('updating '+msg.username+' '+[msg.position.longitude,msg.position.latitude]+" "+msg.date)
    var position = {coordinates: [msg.position.longitude,
                                  msg.position.latitude]};
    var marker = map.makeMarker(position, user.username);
    marker.setIcon(map.makeIcon(user.marker_image_url, 12, 20))
    msg.marker = marker
    var speed = 0;

    if(user.locations.length > 0) {
      var last_location = user.locations[0]

      // determine speed
      speed = speed_calc(new Date(last_location.date),
                         map.latLngToPoint(last_location.marker.getLatLng()),
                         new Date(msg.date),
                         map.latLngToPoint(marker.getLatLng()) )
      // old positions get subtle marker
      var icon_name = msg.provider || "api"
      last_location.marker.setIcon(map.makeIcon("/assets/mapmarkers/"+icon_name+".png", 7, 7))

      // summary
      var accuracy = ""
      if(msg.position.accuracy) { accuracy = "acc "+
                                  Math.floor(last_location.position.accuracy)+"m"}
      var speed_str = Math.floor(speed)+" m/s"
      last_location.marker.setPopupContent(last_location.provider+" "+accuracy+" "+speed_str)
    }

    user.locations.unshift(msg);
    console.log(user.username+" speed "+speed)
    if (speed < 30) {
      user.line.addLatLng(map.pointToLatLng(position))
    } else {
      //user.line.spliceLatLngs(0, user.line.getLatLngs().length)
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

function speed_calc(d1, p1, d2, p2) {
  var seconds = (d2-d1)/1000
  var meters = gju.pointDistance(p1, p2);
  return meters/seconds;
}

function add_user_ui(username) {
  var user = group[username];
  var fields = {
    UserName: username, TimeAgo: "", ImageUrl: user.marker_image_url
  };
  $('#trackedlist tbody').append($("#trackedUserTemplate").render(fields));
  $('#'+username+'-profile .profilelink').click(function(){center_on_username(username); return false})
  user.line = map.makeLine([])
}

function center_on_username(username) {
  var user = group[username];
  var last_marker = user.locations[0].marker
  map.setCenter(last_marker.getPosition());
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