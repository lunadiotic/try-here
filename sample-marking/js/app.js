// Initialize the platform object:
var platform = new H.service.Platform({
  apikey: "P1pW6jQAuEzQsilkH4NPdHHqaUbuHot9X9XnyTSsgrE"
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    zoom: 12,
    center: { lat: -6.879518, lng: 107.590082 }
  }
);

// Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);
var behavior = new H.mapevents.Behavior(mapEvents);

// Add event listener:
map.addEventListener("drag", function(evt) {
  let coor = map.screenToGeo(
    evt.currentPointer.viewportX,
    evt.currentPointer.viewportY
  );
  // Log 'tap' and 'mouse' events:
  console.log(evt.type, evt.currentPointer.type);
  console.log(coor);
});

// Add event listener:
map.addEventListener("tap", function(evt) {
  let coor = map.screenToGeo(
    evt.currentPointer.viewportX,
    evt.currentPointer.viewportY
  );
  // Log 'tap' and 'mouse' events:
  console.log(evt.type, evt.currentPointer.type);
  console.log(coor);
});

// Set up five markers.
var coords = [
  { lat: -6.907354700608601, lng: 107.60469958304263 },
  { lat: -6.920209494977641, lng: 107.61778629168379 },
  { lat: -6.92116675290282, lng: 107.59739857716914 },
  { lat: -6.923218013347737, lng: 107.62233220100127 },
  { lat: -6.926500011510953, lng: 107.60235775097001 },
  { lat: -6.913928052671932, lng: 107.57920155414376 }
];

//Create the svg mark-up
var svgMarkup = "";

coords.forEach(function(value, index) {
  var svgMarkup =
    '<svg width="24" height="24" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">' +
    (index + 1) +
    "</text></svg>";

  var icon = new H.map.Icon(svgMarkup),
    marker = new H.map.Marker(value, { icon: icon });

  // add custom data to the marker
  marker.setData(index + 1);

  // set draggable attribute on the marker so it can recieve drag events
  marker.draggable = true;
  map.addObject(marker);
});
