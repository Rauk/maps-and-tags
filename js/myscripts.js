var tagsList = ["Restaurants", "Banks", "Rivers"];

function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 21.0000, lng: 78.0000},
        zoom: 5
    });
    
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    var infowindow;
    infowindow = new google.maps.InfoWindow();

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

      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];
        
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: "../img/icon-marker1.png",
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

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
function populateSavedCounties(data) {
    var items = [];
    $.each(data, function (id, option) {
        items.push('<li>' + option.name + '</li>');
    });  
    $("#searchResults").empty();
    $('#searchResults').append( items.join('') );
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