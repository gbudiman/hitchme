// var gmaps_client = require('@google/maps').createClient({
//   key: 'AIzaSyB0HMkhjSZwLxLMtOzokyyxQueN6G7fGK0'
// })
var map;

function init_map() {
  GMaps.geocode({
    address: 'Los Angeles, CA',
    callback: function(results, status) {
      if (status == 'OK') {
        var latlng = results[0].geometry.location;

        map = new GMaps({
          el: '#map-canvas',
          lat: latlng.lat(), 
          lng: latlng.lng(),
          width: '800px',
          height: '600px',
          zoom: 10
        })

        //test_routing();
        reposition(map);
        $(window).resize(function() {
          reposition(map);
        });
        attach_address_autocomplete();
      }
    }
  })

  
}

function test_routing() {
  GMaps.geocode({
    address: 'Santa Monica, CA',
    callback: function(o_results, o_status) {
      if (o_status == 'OK') {
        var o_latlng = o_results[0].geometry.location;

        GMaps.geocode({
          address: 'Corona, CA',
          callback: function(d_results, d_status) {
            if (d_status == 'OK') {
              var d_latlng = d_results[0].geometry.location;

              map.getRoutes({
                origin: [o_latlng.lat(), o_latlng.lng()],
                destination: [d_latlng.lat(), d_latlng.lng()],
                travelMode: 'driving',
                callback: function(r_results) {
                  map.drawRoute({
                    origin: [o_latlng.lat(), o_latlng.lng()],
                    destination: [d_latlng.lat(), d_latlng.lng()],
                    travelMode: 'driving'
                  })

                  test_intersect(r_results, 'Los Angeles, CA');
                  test_intersect(r_results, 'Topanga, CA');
                  test_intersect(r_results, 'Monrovia, CA');
                  test_intersect(r_results, 'Riverside, CA');
                }
              })
            } else {
              console.log('Failed to map destination');
            }
          }
        })
      } else {
        console.log('Failed to map origin');
      }
    }
  })
}

function test_intersect(r, x) {
  test_place_marker(x).then(function(marker) {
    find_shortest_intersection(r, marker).then(function(trig) {
      console.log(' ======= Shortest intersection from ' + x + ': ' + trig.distance);
      draw_triangle(trig, marker);
    });
  })
  //test_haversine();

}

function draw_triangle(trig, marker) {
  path = new Array();

  
  path.push([trig.stop.lat(), trig.stop.lng()]);
  path.push([marker.latlng.lat(), marker.latlng.lng()]);

  if (trig.start != undefined) {
    path.push([trig.start.lat(), trig.start.lng()]);
    path.push([marker.latlng.lat(), marker.latlng.lng()]);
  }

  map.drawPolyline({
    path: path
  })
}

function find_shortest_intersection(r, marker) {
  var min_distance = Number.MAX_SAFE_INTEGER;
  var min_start, min_stop;
  var latched_distance;

  var expand_latlng = function(x) {
    return [x.lat(), x.lng()];
  }

  var expand_point = function(x) {
    return get_distance(x, marker.latlng);
  }

  var update_min = function(start, stop, _dist) {
    if (latched_distance == undefined) {
      dist = _dist;
    } else {
      dist = (latched_distance + _dist) / 2;
    }

    latched_distance = _dist;

    if (dist < min_distance) {
      min_distance = dist;
      min_start = start;
      min_stop = stop;
    }
  }

  return new Promise(
    function(resolve, reject) {
      $.each(r, function(h, route) {
        $.each(route.legs, function(i, leg) {
          var step_count = leg.steps.length;

          $.each(leg.steps, function(j, step) {
            switch(j) {
              case 0:
                console.log(expand_latlng(step.start_location) + ': ' + expand_point(step.start_location));
                update_min(null, step.start_location, expand_point(step.start_location));
              default:
                console.log(expand_latlng(step.end_location) + ': ' + expand_point(step.end_location));
                update_min(step.start_location, step.end_location, expand_point(step.end_location));
                break;
            }
          })
        })

        resolve({
          start: min_start,
          stop: min_stop,
          distance: min_distance
        })
      })
    }
  );
}

function test_place_marker(x) {
  return new Promise(
    function(resolve, reject) {
      place_marker_on_address(x).then(function(latlng) {
        resolve({
          address: x,
          latlng: latlng
        })
      })
    }
  );
}

function test_haversine() {
  var places = new Array();
  var loaded = 0;
  var push_promise = function(x) {
    places.push(x);
    loaded++;

    if (loaded == 4) {
      run_test();
    }
  }
  
  test_place_marker('Los Angeles, CA').then(push_promise);
  test_place_marker('Long Beach, CA').then(push_promise);
  test_place_marker('Glendale, CA').then(push_promise);
  test_place_marker('Pasadena, CA').then(push_promise);

  var run_test = function() {
    for (var i = 0; i < places.length; i++) {
      for (var j = i + 1; j < places.length; j++) {
        var a = places[i].latlng;
        var b = places[j].latlng;
        var d = get_distance(a, b);

        console.log(places[i].address + ' -> ' + places[j].address + ' = ' + d);
      }
    }
  }
}

function place_marker_on_address(x) {
  return new Promise(
    function(resolve, reject) {
      get_latlng_from_address(x)
        .then(function(latlng) {
          console.log(latlng);
          map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng()
          })

          resolve(latlng);
      }).catch(
        function(reason) {
          reject(reason);
        }
      )
    }
  );
}

function get_latlng_from_address(x) {
  return new Promise(
    function(resolve, reject) {
      GMaps.geocode({
        address: x,
        callback: function(results, status) {
          if (status == 'OK') {
            resolve(results[0].geometry.location);
          } else {
            reject(status);
          }
        }
      })
    }
  );
}