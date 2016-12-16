var address_is_valid = false;
var timeline_is_valid = false;

function check_form_is_valid() {
  var name_is_not_empty = $('#event-name').val().trim().length > 0;

  if (name_is_not_empty && address_is_valid && timeline_is_valid) {
    $('#event-create').prop('disabled', false);

    return true;
  } else {
    $('#event-create').prop('disabled', true);

    return false;
  }
}

function check_forward_timeline() {
  var current = moment();
  var start = $('#event-start-date').val().trim();
  var end = $('#event-end-date').val().trim();

  if (start.length != 0 && end.length != 0) {
    if (!moment(start).isBefore(end)) {
      $('#event-end-date')
        .data('DateTimePicker')
          .date(moment(start).add(1, 'days'));

      alert('End Time must be after Start Time');
    }
  }

  console.log($('#event-start-date').val());
  if (start.length != 0 && !moment().isBefore(moment(start))) {
    console.log('here');
    $('#event-start-date')
      .data('DateTimePicker')
        .date(moment(current).add(1, 'days'));

    alert('You can\'t create event in the past');
  }

  if (end.length != 0 && !moment().isBefore(moment(end))) {
    $('#event-end-date')
      .data('DateTimePicker')
        .date(moment(current).add(1, 'days'));

    alert('You can\'t create event in the past');
  }

  timeline_is_valid = true;
  check_form_is_valid();
}

function handle_address_input(event, value) {
  var key_code = event.keyCode ? event.keyCode : event.which;

  if (key_code == 13) {
    handle_map_update_address(value);
  }
}

function handle_map_update_address(address) {
  place_marker_on_address(address)
    .then(function(latlng) {
      map.panTo(latlng);
      address_is_valid = true;
      check_form_is_valid();
  }).catch(
    function(reason) {
      address_is_valid = false;
      check_form_is_valid();

      switch(reason) {
        case 'ZERO_RESULTS':
          alert('No such address found');
          break;
        default:
          alert('Generic exception: ' + reason);
      }
    }
  );

  
}

// This function must be called upon map load
// See init_map() in planner.js
function attach_address_autocomplete() {

  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('event-address'));

  autocomplete.addListener('place_changed', function() {
    handle_map_update_address($('#event-address').val());
  })
}

function attach_create_event() {
  $('#event-create').on('click', function() {
    if (!check_form_is_valid()) { return; }

    var that = $(this);
    that.prop('disabled', true).text('Creating event...');

    $.ajax({
      type: 'POST',
      url: '/event/create',
      data: {
        name: $('#event-name').val().trim(),
        address: $('#event-address').val().trim(),
        start_time: $('#event-start-date').val().trim(),
        end_time: $('#event-end-date').val().trim()
      }
    }).done(function(result) {
      if (result.status == 'success') {
        console.log(result.data);
        that.prop('disabled', true).text('Create Event');
      }
      alert('success');
    }).fail(function() {
      alert('error');
      that.prop('disabled', false).text('Failed. Try again?')
    })
  })
}

$(function() {
  $('#event-start-date').datetimepicker({
    sideBySide: true,
    defaultDate: moment().add(1, 'day')
  }).on('dp.change', check_forward_timeline);

  $('#event-end-date').datetimepicker({
    sideBySide: true,
    defaultDate: moment().add(2, 'day')
  }).on('dp.change', check_forward_timeline);

  // $('#event-start-date').val('');
  // $('#event-end-date').val('');
  $('#event-name').focus();
  check_form_is_valid();

  $('#event-address').keypress(function(event) {
    handle_address_input(event, $(this).val());
  })

  $('#event-name')
    .on('blur', check_form_is_valid)
    .keyup(function(event) {
      check_form_is_valid();
    });

  attach_create_event();  
})