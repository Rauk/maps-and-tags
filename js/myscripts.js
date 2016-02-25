function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 21.0000, lng: 78.0000},
        zoom: 5
    });
}
    
    
var metroPolitanCities = {
    {"Hyderabad"   : 17.3700, 78.4800}, 
    {"New Delhi"   : 28.6139, 77.2090},
    {"Kolkata"     : 22.5667, 88.3667},
    {"Chennai"     : 13.0827, 80.2707},
    {"Mumbai"      : 18.9750, 72.8258},
    {"Bengaluru"   : 12.9667, 77.5667}
}