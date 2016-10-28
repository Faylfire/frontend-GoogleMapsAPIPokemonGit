var map;

var markers = [];

var polygon = null;

var modal = document.getElementById('myModal');
var myForm = document.getElementById('myForm');
var span = document.getElementsByClassName("close")[0];
var addPokeButton = document.getElementById('add-Pokemon');

span.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};



function initMap() {

	  //Styles for a new map style other than default google
	  var styles = [
	  {
	  	featureType: 'water',
	  	stylers: [
	  	//{ color: '#19a0d8' }
      {color: '#42a4f4'}
	  	]
	  },{
	  	featureType: 'administrative',
	  	elementType: 'labels.text.stroke',
	  	stylers: [
	  	{ color: '#ffffff' },
	  	{ weight: 6 }
	  	]
	  },{
	  	featureType: 'administrative',
	  	elementType: 'labels.text.fill',
	  	stylers: [
	  	{ color: '#e85113' }
	  	]
	  },{
	  	featureType: 'road.highway',
	  	elementType: 'geometry.stroke',
	  	stylers: [
	  	//{ color: '#efe9e4' },
      {color:'#fff6a8'},
	  	{ lightness: -40 }
	  	]
	  },{
	  	featureType: 'transit.station',
	  	stylers: [
	  	{ weight: 5 },
	  	{ hue: '#e85113' }
	  	]
	  },{
	  	featureType: 'road.highway',
	  	elementType: 'labels.icon',
	  	stylers: [
	  	{ visibility: 'off' }
	  	]
	  },{
	  	featureType: 'water',
	  	elementType: 'labels.text.stroke',
	  	stylers: [
	  	{ lightness: 100 }
	  	]
	  },{
	  	featureType: 'water',
	  	elementType: 'labels.text.fill',
	  	stylers: [
	  	{ lightness: -100 }
	  	]
	  },{
	  	featureType: 'poi',
	  	elementType: 'geometry',
	  	stylers: [
	  	{ visibility: 'on' },
	  	{ color: '#f0e4d3' }
	  	]
	  },{
	  	featureType: 'road.highway',
	  	elementType: 'geometry.fill',
	  	stylers: [
	  	//{ color: '#efe9e4' },
      {color: '#ebe4ef'},
	  	{ lightness: -25 }
	  	]
	  }
	  ];

//google Map Object bound to 'map' div element
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.7413549, lng:-73.9980244},
		zoom: 13,
		styles: styles,
		mapTypeControl: false,
	});

/*
//Single Marker
var tribeca = {lat:40.719526, lng: -74.0089934};

var marker = new google.maps.Marker({
	position: tribeca,
	map: map,
	title: "First Marker!"
});

var infowindow = new google.maps.InfoWindow({
	content: "Do you ever feel like an InfoWindow, Not doing much"
});

marker.addListener("click", function(){
	infowindow.open(map, marker);
});

*/

//Multiple Markers
  var locIndex = 0;
  var newLatLng = null;
  var largeInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  var locations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}, src:"resource/pokeballSmall.png", type:'none',},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}, src:"resource/pokeballSmall.png", type:'none',},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng:-73.9895759}, src:"resource/pokeballSmall.png", type:'none',},
    {title: 'East Village Hip Stuido', location: {lat: 40.7281777, lng: -73.984377}, src:"resource/pokeballSmall.png", type:'none',},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.719526, lng: -74.0089934}, src:"resource/pokeballSmall.png", type:'none',},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628,lng:-73.9961237}, src:"resource/pokeballSmall.png", type:'none',},
  ];

  //Creates a Marker and saves to marker list for each location in the locations list
  locations.forEach(function(element, index){
  	addMarker(element, index);
  });
  map.fitBounds(bounds);

  function addMarker(element, index) {
  	locIndex = index;
  	var position = element.location;
    var title = element.title;
    var imgSrc = element.src;
    var pType = element.type;
    //resizes an image to be used as an icon
    var icon = {
    url: imgSrc, // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
	};


    //console.log(index);
    var m = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: index,
      //label: (index+1).toString(),
      imgSrc: imgSrc,
      icon: icon,
      pType: pType,
    });
    markers.push(m);
    bounds.extend(m.position);

    m.addListener('click', function(){
      populateInfoWindow(this, largeInfoWindow);
    });

  }

  //Creates marker clustering to show groups of markers in lieu of multiple overlapping markers
  /*var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
             gridSize: 40,
        	}
        );*/

  //hideListings();


  //Enables drawing of polygons on google maps
  var drawingManager = new google.maps.drawing.DrawingManager({
  	drawingMode: google.maps.drawing.OverlayType.POLYGON,
  	drawingControl: true,
  	drawingControlOptions:{
  		position: google.maps.ControlPosition.TOP_LEFT,
  		drawingModes: [
  			google.maps.drawing.OverlayType.POLYGON
  		]
  	}
  });


  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
  document.getElementById('toggle-drawingtools').addEventListener('click', function(){
  	toggleDrawing(drawingManager);
  	if (polygon){
  		polygon.setMap(null);
  	}
  });
  addPokeButton.addEventListener('click', function(event){
    addPokemon(event.srcElement.form);
  });
  var geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  drawingManager.addListener('overlaycomplete', function(event){
  	//Check if there is an existing polygon and remove it plus markers
  	if (polygon){
  		polygon.setMap(null);
  		hideListings();
  	}

  	//Switch drawing mode to Hand (i.e. no longer drawing).
  	drawingManager.setDrawingMode(null);
  	//Creating a new editable polygon from the overlay.
  	polygon = event.overlay;
  	polygon.setEditable(true);
  	//Search within the polygon.
  	searchWithinPolygon();
  	//calculate the area
  	calcAreaWithinPolygon();
  	//Make sure the search is re-done if the poly is changed.
  	polygon.getPath().addListener('set_at', searchWithinPolygon);
  	polygon.getPath().addListener('insert_at', searchWithinPolygon);


  });


  function populateInfoWindow(marker, infowindow){
    if (infowindow.marker != marker){
   	  infowindow.setContent('');
      infowindow.marker = marker;
      content = '<div id="popupTitle">'+ marker.title + '</div>';
      contentImg = '<div><img src=' + marker.imgSrc + '></div>';
      contentPano = '<div id="pano"></div>';
      contentNoPano = '<div>No Street View Found</div>';
      //create a streetViewService
      var streetViewService = new google.maps.StreetViewService();
      //search in a radius of 50 meters
      var radius = 50;

      //In case the status is OK, which means the pano was found, compute
      //the position of the streetview image, then calculate the heading,
      //then get a panorama from that and set the options

      function getStreetView(data, status) {
      	if (status == google.maps.StreetViewStatus.OK){
      		var nearStreetViewLocation = data.location.latLng;
      		var heading = google.maps.geometry.spherical.computeHeading(
      			nearStreetViewLocation, marker.position);
      		console.log(contentPano);
      		infowindow.setContent(content+contentPano);

      		var panoramaOptions = {
      			position: nearStreetViewLocation,
      			pov: {
      				heading: heading,
      				pitch: 30,
      			}
      		};

      		var panorama = new google.maps.StreetViewPanorama(
      			document.getElementById('pano'), panoramaOptions);
          var pano = new google.maps.StreetViewPanorama(
            document.getElementById('stretch'), panoramaOptions);

      	} else {
      		infowindow.setContent(content + contentNoPano);
      	}
      }

      //Use streetview service to get the closest streetview image within 50 meters
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);


      //content = '<div>'+ marker.title + '</div>';
      //contentImg = '<div><img src=' + marker.imgSrc + '></div>';
      //infowindow.setContent(content + contentImg);
      infowindow.open(map, marker);

      infowindow.addListener('closeclick', function(){
        infowindow.setMap(null);
      });
    }
  }

  function searchWithinPolygon(){
  	for (var i = 0; i < markers.length; i++){
  		if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)){
  			markers[i].setMap(map);
  		} else {
  			markers[i].setMap(null);
  		}
  	}
  }

  function calcAreaWithinPolygon(){
  	console.log(polygon);
  	polyLatLng = polygon.getPath();
  	polyArea = google.maps.geometry.spherical.computeArea(polyLatLng);
  	polyAreaSqrFeet = polyArea*10.7639;
  	polyAreaMiles = (polyArea*Number('3.861e-7')).toFixed(2);
  	//console.log(polyArea);
  	//console.log(polyAreaSqrFeet);
  	//console.log(polyAreaMiles+" sq mi");
  	spanText = polyAreaMiles+" sq mi";

  	document.getElementById('poly-area').textContent=spanText;
  }

  //Show and Hide Markers on the map by setting their map property
  function showListings(){
  	markers.forEach(function(element){
  		element.setMap(map);
  	})
  }

  function hideListings(){
  	markers.forEach(function(element){
  		element.setMap(null);
  	}) 
  }

  function toggleDrawing(drawingManager){
  	if (drawingManager.map){
  		drawingManager.setMap(null);
  	} else {
  		drawingManager.setMap(map);
  	}
  }

    /*
  	  var laSagrada= {lat:41.40343, lng: 2.17478};
  	  var pano = new google.maps.StreetViewPanorama(
      document.getElementById('stretch'), {
        position: laSagrada,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
   */

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(e) {
  	modal.style.display = "block";
    document.getElementById('pokeName').focus();
  	newLatLng = e.latLng;
    //placeMarker(e.latLng, map);
  });


  function addPokemon(form){
	pokemon= form.name.value;
    item = form.pokeType.selectedIndex;
    pokeType = form.pokeType.options[item].text;

    placeMarker(newLatLng, map, pokemon, pokeType);
    modal.style.display = "none";
    myForm.reset();
  }

  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {

        resultsMap.setOptions({
        center: results[0].geometry.location,
        zoom: 13
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }



  function placeMarker(position, map, pokemon, type) {
/*    var marker = new google.maps.Marker({
      position: position,
      map: map
    }); */

    src = "resource/"+getIcon(type);

    var location = {
    	title: pokemon ,
    	location: position,
    	src:src,
      type:type

    }; 
    locations.push(location);
   	addMarker(location, locIndex);
    //map.panTo(position);
  }

  function getIcon(type){
  	var pokeTypes = {
  		  none: "pokeballSmall.png",
        bug: "butterfree.png",
        dragon: "dragonaire.png",
        electric: "pikachu.png",
        fairy: "clefairy.png",
        fighting: "machop.png",
        fire: "growlithe.png",
        flying: "pidgeot.png",
        ghost: "ghastly.png",
        grass: "bulbasaur.png",
        ground: "sandshrew.png",
        normal: "snorlax.png",
        poison: "arbok.png",
        psychic: "abra.png",
        rock: "golem.png",
        water: "vaporeon.png",
  	}
  	return pokeTypes[type.toLowerCase()];

  }


}