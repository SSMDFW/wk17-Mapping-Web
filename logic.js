
// 1. **Get your data set**
//    ![3-Data](Images/3-Data.png)
//    The USGS provides earthquake data in a number of different formats, updated every 5 minutes. 
//    Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) 
//    page and pick a data set to visualize. When you click on a data set, for example 
//    'All Earthquakes from the Past 7 Days', you will be given a JSON representation of that data. 
//    You will be using the URL of this JSON to pull in the data for our visualization.


var url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



d3.json(url1, function(data) {

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
       
        var color = getColor(feature.properties.mag);
            
            
        var geojsonMarkerOptions = {
                radius: 4*feature.properties.mag,
                fillColor: color,
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                    };
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                });
        function getColor(d) {
                    return d < 1 ? 'rgb(255,255,255)' :
                          d < 2  ? 'rgb(255,153,255)' :
                          d < 3  ? 'rgb(255,102,255)' :
                          d < 4  ? 'rgb(255,51,255)' :
                          d < 5  ? 'rgb(210,0,210)' :
                          d < 6  ? 'rgb(180,0,205)' :
                          d < 7  ? 'rgb(140,0,150)' :
                          d < 8  ? 'rgb(100,0,153)' :
                          d < 9  ? 'rgb(76,0,175)' :
                                   'rgb(51,0,125)';
              }

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  
}
function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      //maxZoom: 18,
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
         "Street Map" : streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Earthquakes" : earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    function getColor(d) {
        return d < 1 ? 'rgb(255,255,255)' :
        d < 2  ? 'rgb(255,153,255)' :
        d < 3  ? 'rgb(255,102,255)' :
        d < 4  ? 'rgb(255,51,255)' :
        d < 5  ? 'rgb(210,0,210)' :
        d < 6  ? 'rgb(180,0,205)' :
        d < 7  ? 'rgb(140,0,150)' :
        d < 8  ? 'rgb(100,0,153)' :
        d < 9  ? 'rgb(76,0,175)' :
                 'rgb(51,0,125)';
  }


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(map);
}
//   function createMarkers(response) {
  
//     // Pull the "stations" property off of response.data
//     var stations = response.data.stations;
  
//     // Initialize an array to hold bike markers
//     var bikeMarkers = [];
  
//     // Loop through the stations array
//     for (var index = 0; index < stations.length; index++) {
//       var station = stations[index];
  
//       // For each station, create a marker and bind a popup with the station's name
//       var bikeMarker = L.marker([station.lat, station.lon])
//         .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>");
  
//       // Add the marker to the bikeMarkers array
//       bikeMarkers.push(bikeMarker);
//     }
  
//     // Create a layer group made from the bike markers array, pass it into the createMap function
//     createMap(L.layerGroup(bikeMarkers));
//   }
  
  
//   // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
//   d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", createMarkers);


