if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        coor = position.coords;

        let platform = new H.service.Platform({
            'apikey': 'P1pW6jQAuEzQsilkH4NPdHHqaUbuHot9X9XnyTSsgrE'
        });

        let defaultLayers = platform.createDefaultLayers();
        let map = new H.Map(
            document.getElementById('mapContainer'),
            defaultLayers.vector.normal.map,
            {
                zoom: 13,
                center: { lat: coor.latitude, lng: coor.longitude }
            });

        // let marker = new H.map.Marker({ lat: coor.latitude, lng: coor.longitude });
        let ui = H.ui.UI.createDefault(map, defaultLayers);
        let mapEvents = new H.mapevents.MapEvents(map);
        let behavior = new H.mapevents.Behavior(mapEvents);

        var coords = [
            { lat: -6.907354700608601, lng: 107.60469958304263 },
            { lat: -6.920209494977641, lng: 107.61778629168379 },
            { lat: -6.92116675290282, lng: 107.59739857716914 },
            { lat: -6.923218013347737, lng: 107.62233220100127 },
            { lat: -6.926500011510953, lng: 107.60235775097001 },
            { lat: -6.913928052671932, lng: 107.57920155414376 }
        ];

        coords.forEach(function (value, index) {
            var marker = new H.map.Marker(value);

            marker.addEventListener('tap', function (evt) {
                // Log 'tap' and 'mouse' events:
                let coord = map.screenToGeo(
                    evt.currentPointer.viewportX,
                    evt.currentPointer.viewportY
                );
                // Log 'tap' and 'mouse' events:
                // console.log(`/route.html?from=${coor.latitude},${coor.longitude}&end=${coord.lat},${coord.lng}`);
                // window.open(`/route.html?from=${coor.latitude},${coor.longitude}&end=${coord.lat},${coord.lng}`, "_self");

                // Routing
                // Create the parameters for the routing request:
                var routingParameters = {
                    // The routing mode:
                    'mode': 'fastest;car',
                    // The start point of the route:
                    'waypoint0': `geo!${coor.latitude},${coor.longitude}`,
                    // The end point of the route:
                    'waypoint1': `geo!${coord.lat},${coord.lng}`,
                    // To retrieve the shape of the route we choose the route
                    // representation mode 'display'
                    'representation': 'display'
                };

                // Define a callback function to process the routing response:
                var onResult = function (result) {
                    var route,
                        routeShape,
                        startPoint,
                        endPoint,
                        linestring;
                    if (result.response.route) {
                        // Pick the first route from the response:
                        route = result.response.route[0];
                        // Pick the route's shape:
                        routeShape = route.shape;

                        // Create a linestring to use as a point source for the route line
                        linestring = new H.geo.LineString();

                        // Push all the points in the shape into the linestring:
                        routeShape.forEach(function (point) {
                            var parts = point.split(',');
                            linestring.pushLatLngAlt(parts[0], parts[1]);
                        });

                        // Retrieve the mapped positions of the requested waypoints:
                        startPoint = route.waypoint[0].mappedPosition;
                        endPoint = route.waypoint[1].mappedPosition;

                        // Create a polyline to display the route:
                        var routeLine = new H.map.Polyline(linestring, {
                            style: {
                                lineWidth: 10,
                                strokeColor: 'rgba(0, 128, 255, 0.7)',
                                lineTailCap: 'arrow-tail',
                                lineHeadCap: 'arrow-head'
                            }
                        });

                        // Create a patterned polyline:
                        var routeArrows = new H.map.Polyline(linestring, {
                            style: {
                                lineWidth: 10,
                                fillColor: 'white',
                                strokeColor: 'rgba(255, 255, 255, 1)',
                                lineDash: [0, 2],
                                lineTailCap: 'arrow-tail',
                                lineHeadCap: 'arrow-head'
                            }
                        }
                        );

                        // Create a marker for the start point:
                        var svgStartMark = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve" width="512px" height="512px"><g><path d="M38.853,5.324L38.853,5.324c-7.098-7.098-18.607-7.098-25.706,0h0  C6.751,11.72,6.031,23.763,11.459,31L26,52l14.541-21C45.969,23.763,45.249,11.72,38.853,5.324z M26.177,24c-3.314,0-6-2.686-6-6  s2.686-6,6-6s6,2.686,6,6S29.491,24,26.177,24z" data-original="#1081E0" class="active-path" data-old_color="#1081E0" fill="#C12020"/></g> </svg>`;

                        var iconStart = new H.map.Icon(svgStartMark, {
                            size: { h: 45, w: 45 }
                        });
                        var startMarker = new H.map.Marker({
                            lat: startPoint.latitude,
                            lng: startPoint.longitude
                        }, { icon: iconStart });

                        // Create a marker for the end point:
                        var svgEndMark = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve"> <path style="fill:#1081E0;" d="M38.853,5.324L38.853,5.324c-7.098-7.098-18.607-7.098-25.706,0h0 C6.751,11.72,6.031,23.763,11.459,31L26,52l14.541-21C45.969,23.763,45.249,11.72,38.853,5.324z M26.177,24c-3.314,0-6-2.686-6-6 s2.686-6,6-6s6,2.686,6,6S29.491,24,26.177,24z"/></svg>`;

                        var iconEnd = new H.map.Icon(svgEndMark, {
                            size: { h: 45, w: 45 }
                        });
                        var endMarker = new H.map.Marker({
                            lat: endPoint.latitude,
                            lng: endPoint.longitude
                        }, { icon: iconEnd });

                        // Add the route polyline and the two markers to the map:
                        map.addObjects([routeLine, routeArrows, startMarker, endMarker]);

                        // Set the map's viewport to make the whole route visible:
                        map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
                    }
                };

                // Get an instance of the routing service:
                var router = platform.getRoutingService();

                // Call calculateRoute() with the routing parameters,
                // the callback and an error callback function (called if a
                // communication error occurs):
                router.calculateRoute(routingParameters, onResult,
                    function (error) {
                        alert(error.message);
                    });
            });

            // add custom data to the marker
            marker.setData(index + 1);

            // set draggable attribute on the marker so it can recieve drag events
            map.addObject(marker);
        });

    });
} else {
    console.error("Geolocation is not supported by this browser!");
}