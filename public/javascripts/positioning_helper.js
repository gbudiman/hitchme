function reposition(map) {
  $('#map-canvas').css('width', $(window).width() - $('#map-interactions').outerWidth() - 32);
  google.maps.event.trigger(map, 'resize');
}