var tagsList = ["restaurants", "banks", "rivers"];
var dictPlaces = {banks : ["ChIJETLkmGRdUjoRQgBxB0_ucKk"]};
var placesInfo = {
    ChIJETLkmGRdUjoRQgBxB0_ucKk : {pos: [14.1652, 77.8117], marker:null, name: "Prashanthi Nilayam"}
};
var map;
var gTextAreaValue, infowindow;
 var placeTags = {
     ChIJETLkmGRdUjoRQgBxB0_ucKk : ["banks"]
 };
var markers = [];
var markersMap = {};
function initMap() {
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: {lat: 21.0000, lng: 78.0000},
        zoom: 5
    });
    
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    
    
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
            var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });
            markers.push(marker);
            markersMap[place.place_id] = marker;
            infoWindowListener(marker, place, map);
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
        
        var tags;
        if (placesInfo[place.place_id]) {
            tags = placeTags[place.place_id].join(", ");
            tags = "Existing Tags : " + tags;
        } else {
            tags = "";
        }
//            infowindow.setContent(place.name + place.formatted_address);
//        var infowindow;
//    infowindow = new google.maps.InfoWindow();
        
        var idStr = "iW_id_" + place.place_id;
        var str = '<div class="iW_id_class">Name : ' + place.name + '</div>' + 
              '<div id="' + idStr + '" class="iW_id_class">' + tags + '</div>' + 
              '<div id="' + 'a_id_' + place.place_id + '" class="a_id_class" data-id="' + place.place_id + '">' + 'Click to edit tags' + '<\div>';
//        console.log (str);
        infowindow.setContent(str);
        infowindow.open(map, this);
    });
  }
//function populateSavedCounties(select, data) {
function populateSavedCounties(data) {
    var items = [];
    $.each(data, function (id, option) {
        items.push('<li class="list-group-item">' + option.name + '</li>');
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
//        console.log(ev, $(this).data("id"));
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
    var text = $("#tag-input").val().trim();
    if (text.length == 0) {
        alert("Empty field");
            return;
    }
    for(var x = 0; x < tagsList.length; x++){
        if(tagsList[x].toLowerCase() == text.toLowerCase()) {
            alert("Tag exists with same name");
            return;
        }
    }
    tagsList.push(text.toLowerCase());
    $("#tag-input").focus().val("");
    console.log(tagsList);
    $("#statusText").text("Tag(s) created successfully");
    setTimeout(function(){
        $("#statusText").addClass('hide');
    }, 2000);
    
});

//function infoWindowListener(var marker, var place, var infoWindow, var tags, var map) {
function infoWindowListener(marker, place, map) {
    
    google.maps.event.addListener(marker, 'click', function() {
        var tags;
        if (placesInfo[place.place_id]) {
            tags = placeTags[place.place_id].join(", ");
            tags = "Existing Tags : " + tags;
        } else {
            tags = "";
        }
//            infowindow.setContent(place.name + place.formatted_address);
//        var infowindow;
//    infowindow = new google.maps.InfoWindow();
        
        var idStr = "iW_id_" + place.place_id;
        var str = '<div class="iW_id_class">Name : ' + place.name + '</div>' + 
              '<div id="' + idStr + '" class="iW_id_class">' + tags + '</div>' + 
              '<div id="' + 'a_id_' + place.place_id + '" class="a_id_class" data-id="' + place.place_id + '">' + 'Click to edit tags' + '<\div>';
//        console.log (str);
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
    var flag = false;
//    dictPlaces[str1] = [];
    for (var i = 0; i < newTag.length; i++) {
        var str1 = newTag[i].trim().toLowerCase();
        if (tagsList.indexOf(str1) < 0) {
            flag = true;
            tagsList.push(str1);
        }
        if (flag == true) {
            $("#statusText").text("Tag(s) created successfully");
            setTimeout(function(){
                $("#statusText").addClass('hide');
            }, 2000);
        }
        if (dictPlaces[str1] == undefined) {
            dictPlaces[str1] = [];
        }
        dictPlaces[str1].push(textAreaDataValue);
        placeTags[textAreaDataValue].push(str1);
    }
    $("#iW_id_" + textAreaDataValue).text("Existing Tags : " + textAreaValue);
    console.log(textAreaValue, textAreaDataValue);
    console.log(tagsList);
    console.log(dictPlaces);
    console.log(placesInfo);
    console.log(placeTags);
});

$(document).ready(function () {
    $('#tag-input').on('change', function () {
        console.log(this.value);
        clearMarkers(this.value);
    }).change();
    $('#tag-input').on('autocompleteselect', function (e, ui) {
        console.log(ui.item.value);
        clearMarkers(ui.item.value);
    });
});

function clearMarkers(tag) {
  
  setMapOnAll(null);
    if (tag) {
        var listPlaces = dictPlaces[tag];
        console.log(listPlaces);
        if (listPlaces) {
            for (var tempIndex = 0;tempIndex < listPlaces.length;tempIndex++) {
                initialize(listPlaces[tempIndex]);
            }  
        } else
            return;
        
    } else {
        return;
    }
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}
function showMarkers() {
  setMapOnAll(map);
}
function initialize(placeId) {

    var request = {
        placeId: placeId
    };

    var service = new google.maps.places.PlacesService(map);

    service.getDetails(request, function (place, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            markers.push(marker);
            infoWindowListener(marker, place, map);
        }
    });
}
$('#editTag').click(function() {
    clearMarkers();
    
});