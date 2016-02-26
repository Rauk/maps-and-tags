var tagsList = ["Restaurants", "Banks", "Rivers"];
var dictPlaces = {Banks : ["ChIJETLkmGRdUjoRQgBxB0_ucKk"]};
var placesInfo = {
    ChIJETLkmGRdUjoRQgBxB0_ucKk : {pos: [14.1652, 77.8117], marker:null, name: "Prashanthi Nilayam"}
};
var gTextAreaValue, infowindow;
 var placeTags = {
     ChIJETLkmGRdUjoRQgBxB0_ucKk : ["Banks"]
 };
var markersMap = {};
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
            $('#resultSize').text("There are " + places.length + " results");
            populateSavedCounties(places);
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
        markersMap = {};
        
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
//            var tags;
//            if (placesInfo[place.place_id]) {
//                tags = placeTags[place.place_id].join(", ");
//                tags = "Tags :" + tags;
//            } else {
//                tags = "";
//            }
            var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });
            markers.push(marker);
            markersMap[place.place_id] = marker;
//        placesInfo[place.place_id].marker = marker;
//            var infowindow = new google.maps.InfoWindow();
            infoWindowListener(marker, place, map);
//            google.maps.event.addListener(marker, 'click', function() {
//            
////            infowindow.setContent(place.name + place.formatted_address);
//                infowindow.setContent(place.name + "\n" + tags);
//                var idStr = "iW_id_" + place.place_id;
//                var str = '<div class="iW_id_class">' + place.name + '</div>' + 
//                      '<div id="' + idStr + '" class="iW_id_class">' + tags + '</div>' + 
//                      '<div id="' + 'a_id_' + place.place_id + '" class="a_id_class" data-id="' + place.place_id + '">' + 'Edit/Create tags' + '<\div>';
//                console.log (str);
//                infowindow.setContent(str);
//                infowindow.open(map, this);
//            });
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
$('body').on('click', '.a_id_class', function(ev) {
    var placeId = $(this).data("id");
        console.log(ev, $(this).data("id"));
    $('#myModal').modal()         ;             // initialized with defaults
    if (placeTags[placeId]) {
        gTextAreaValue = placeTags[placeId].join(", ");
        $('#testArea').val(gTextAreaValue);
    } else {
        gTextAreaValue = "";
        $('#testArea').val("");
    }
//$('#testArea').val(placeTags[placeId].join(", "));
    
    $('#testArea').data("id", placeId);

    
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

//function infoWindowListener(var marker, var place, var infoWindow, var tags, var map) {
function infoWindowListener(marker, place, map) {
    
    google.maps.event.addListener(marker, 'click', function() {
        var tags;
        if (placesInfo[place.place_id]) {
            tags = placeTags[place.place_id].join(", ");
            tags = "Tags :" + tags;
        } else {
            tags = "";
        }
//            infowindow.setContent(place.name + place.formatted_address);
//        var infowindow;
//    infowindow = new google.maps.InfoWindow();
        
        var idStr = "iW_id_" + place.place_id;
        var str = '<div class="iW_id_class">' + place.name + '</div>' + 
              '<div id="' + idStr + '" class="iW_id_class">' + tags + '</div>' + 
              '<div id="' + 'a_id_' + place.place_id + '" class="a_id_class" data-id="' + place.place_id + '">' + 'Edit/Create tags' + '<\div>';
        console.log (str);
        infowindow.setContent(str);
        infowindow.open(map, this);
    });
}

$(".a_id_class").click(function(ev) {
    console.log(ev);
});
//$( "body" ).click(function(ev) {
//  console.log(ev);
//});
$('#myModal').on('shown.bs.modal', function () {
  
})

$("#saveTags").click(function() {
    var textAreaValue = $('#testArea').val();
    var textAreaDataValue = $('#testArea').data("id");
    console.log(gTextAreaValue);
    var newTag = gTextAreaValue.split(", ");
    for (var i = 0; i < newTag.length; i++) {
        var str1 = newTag[i].trim();
        if (str1.length > 0) {
            var index = dictPlaces[str1].indexOf(textAreaDataValue);
            if (index > -1) {
                dictPlaces[str1].splice(index, 1);
            }
        }
        
    }
    
    newTag = textAreaValue.split(", ");
    placeTags[textAreaDataValue] = []; 
//    dictPlaces[str1] = [];
    for (var i = 0; i < newTag.length; i++) {
        var str1 = newTag[i].trim().toLowerCase();
        str1 = str1.charAt(0).toUpperCase() + str1.slice(1);
        if (dictPlaces[str1] == undefined) {
            dictPlaces[str1] = [];
        }
        dictPlaces[str1].push(textAreaDataValue);
        placeTags[textAreaDataValue].push(str1);
    }
    $("#iW_id_" + textAreaDataValue).text(textAreaValue);
    console.log(textAreaValue, textAreaDataValue);
    console.log(tagsList);
    console.log(dictPlaces);
    console.log(placesInfo);
    console.log(placeTags);
});