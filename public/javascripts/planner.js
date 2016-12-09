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

        test_routing();
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

                  test_intersect(r_results);
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

function test_intersect(r) {
  console.log(r);

  test_haversine();
}

function test_place_marker(x) {
  return new Promise(
    function(resolve, reject) {
      place_marker_on_address(x).then(function(latlng) {
        console.log('Marker placed at ' + latlng);

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
      get_latlng_from_address(x).then(function(latlng) {
        map.addMarker({
          lat: latlng.lat(),
          lng: latlng.lng()
        })

        resolve(latlng);
      })
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
          }
        }
      })
    }
  );
}