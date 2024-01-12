//url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

//Create a map and pass in some options for it
let map = L.map("map", {
    center: [40.76, -111.89],
    zoom: 3,
});

let basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

basemap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    
    function markerRadius(magnitude) {
        if (magnitude === 0){
            return 1;
        }
        return 2.7 * magnitude
    }

    function markerColor(depth) {
        if (depth > 90){
            return "#ea2c2c"
        } else if (depth > 70){
            return "#ea822c"
        } else if (depth > 50){
            return "#ee9c00"
        } else if (depth > 30){
            return "#eecc00"
        } else if (depth > 10){
            return "#d4ee00"
        } else {
            return "#98ee00"
        }
    }

    function styleInfo(feature) {
        return {
            fillOpacity: 0.9,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            radius: markerRadius(feature.properties.mag),
            weight: 0.5
        }
    }

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag +
                "<br>Depth: " + feature.geometry.coordinates[2]+
                "<br>Location: " + feature.properties.place
            );
        }
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90, 500, 1000],
            colors = ["#ea2c2c", "#ea822c", "#ee9c00", "#eecc00", "#d4ee00", "#98ee00"];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map);
})

