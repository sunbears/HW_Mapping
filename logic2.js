// ADD BASE LAYERS
var outdoors = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?"+
    "access_token=pk.eyJ1Ijoic3VuYmVhcnMiLCJhIjoiY2pld2Q4cTB6MG92dzJxb2ZlZ3JuendiMCJ9._JluEBS7lKtrdQpyU62CFw"
);

var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoic3VuYmVhcnMiLCJhIjoiY2pld2Q4cTB6MG92dzJxb2ZlZ3JuendiMCJ9._JluEBS7lKtrdQpyU62CFw"
);

var satellite = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoic3VuYmVhcnMiLCJhIjoiY2pld2Q4cTB6MG92dzJxb2ZlZ3JuendiMCJ9._JluEBS7lKtrdQpyU62CFw"
);

// CREATE MAP OBJECT
var map = L.map("map", {
    center: [-0.0022, -4.0059],
    zoom: 1.9,
    layers: [outdoors, darkmap, satellite]
});

var baseLayers = {
    "Outdoors": outdoors,
    "Dark Map": darkmap,
    "Satellite": satellite,
};

// var overlayLayers = {
//     "Tectonic Plates": plates
// }

// Add the layer control to the map
L.control
    .layers(baseLayers)
    .addTo(map);

//URL TO JSON FILE
var quakelink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plateslink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

//FUNCTIONS FOR CIRCLEMARKER

function markerSize(magnitude) {
    return magnitude*2;
}

function getColor(d) {
    return d > 4.5 ? '#ff0000' :
        d > 4 ? '#ff8000' :
        d > 3.5  ? '#ffff00' :
        d > 3  ? '#bfff00' :
        d > 2.5  ? '#40ff00' :
        d > 2   ? '#00ff40' :
        d > 1.5   ? '#00ffbf' :
        d > 1   ? '#00bfff' :
        d > 0.5   ? '#0080ff':
                    '#0000ff';
}

// RETRIEVING AND DISPLAYING EARTHQUAKES GEOJSON DATA
//Link for explanation on binding popups within pointToLayer:https://gis.stackexchange.com/questions/184661/how-to-make-both-hover-and-click-popup-work
d3.json(quakelink, function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        
        pointToLayer: function(feature, latlng) {
            
            var popupOptions = {maxWidth: 200};
            
            var popupContent = '<p>'+ 'Magnitude:'+ feature.properties.mag + '</p>'+'<p>'+ feature.properties.place + '</p>';
            
            var geojsonMarkerOptions = {
                radius: markerSize(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "#000",
                weight: 0,
                opacity: 1,
                fillOpacity: 0.8
            };

            return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(popupContent,popupOptions);
        }
    })
    .addTo(map);
});


//ADD LEGEND
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);
