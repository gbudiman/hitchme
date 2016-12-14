function check_forward_timeline() {
  var current = moment();
  var start = $('#event-start-date').val();
  var end = $('#event-end-date').val();

  if (start.length != 0 && end.length != 0) {
    if (!moment(start).isBefore(end)) {
      $('#event-end-date')
        .data('DateTimePicker')
          .date(moment(start).add(1, 'days'));

      alert('End Time must be after Start Time');
    }
  }

  if (start.length != 0 && !moment().isBefore(moment(start))) {
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
}

$(function() {
  $('#event-start-date').datetimepicker({
    inline: true,
    sideBySide: true
  }).on('dp.change', check_forward_timeline);

  $('#event-end-date').datetimepicker({
    inline: true,
    sideBySide: true
  }).on('dp.change', check_forward_timeline);

  $('#event-start-date').val('');
  $('#event-end-date').val('');

  $('#event-address').keypress(function(event) {
    var key_code = event.keyCode ? event.keyCode : event.which;
    if (key_code == 13) {
      place_marker_on_address($(this).val())
        .then(function(latlng) {
          map.panTo(latlng);
        });
    }
  })
})