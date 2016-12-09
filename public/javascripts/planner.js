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

  test_place_marker();
}

function test_place_marker() {
  // get_latlng_from_address('Los Angeles, CA').then(function(latlng) {
  //   console.log('promise fulfilled ' + latlng);
  // })
  place_marker_on_address('Los Angeles, CA').then(function() {
    console.log('Marker placed');
  })
}

function place_marker_on_address(x) {
  return new Promise(
    function(resolve, reject) {
      get_latlng_from_address(x).then(function(latlng) {
        map.addMarker({
          lat: latlng.lat(),
          lng: latlng.lng()
        })

        resolve();
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