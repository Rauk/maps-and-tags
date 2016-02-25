var tagsList = ["Restaurants", "Banks", "Rivers"];

function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 21.0000, lng: 78.0000},
        zoom: 5
    });
    
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    var infowindow;
    infowindow = new google.maps.InfoWindow();

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    google.maps.event.addListener(map, "click", function(event) {
        infowindow.close();
    });
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
        $(".searchResultsClass").show();
      if (places.length == 0) {
          console.log(0, 0);
          $('#resultSize').text("There are no results to display");
          return;
      } else {
          console.log(places.length, places.length);
          $('#resultSize').text("There are " + places.length + " results");
          populateSavedCounties(places);
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];
        
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: "../img/icon-marker1.png",
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name, place.formatted_address);
            infowindow.open(map, this);
        });
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }
    
//var metroPolitanCities = {
//    {"Hyderabad"   : 17.3700, 78.4800}, 
//    {"New Delhi"   : 28.6139, 77.2090},
//    {"Kolkata"     : 22.5667, 88.3667},
//    {"Chennai"     : 13.0827, 80.2707},
//    {"Mumbai"      : 18.9750, 72.8258},
//    {"Bengaluru"   : 12.9667, 77.5667}
//}
//function populateSavedCounties(select, data) {
function populateSavedCounties(data) {
    var items = [];
    $.each(data, function (id, option) {
        items.push('<li>' + option.name + '</li>');
    });  
    $("#searchResults").empty();
    $('#searchResults').append( items.join('') );
    
//    select.html(items.join(''));
}
$( "#tag-input" ).autocomplete({
      source: tagsList
});
$("#createTag").click(function() {
    var text = $("#tag-input").val();
    
    for(var x = 0; x < tagsList.length; x++){
        if(tagsList[x].toLowerCase() == text.toLowerCase()) {
            alert("Tag exists with same name");
            return;
        }
    }
    tagsList.push(text.charAt(0).toUpperCase() + text.slice(1));
    console.log(tagsList);
    
});