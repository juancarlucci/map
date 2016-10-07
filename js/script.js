// adapted from http://codepen.io/prather-mcs/pen/KpjbNN
// and from https://classroom.udacity.com/nanodegrees/nd001/parts/00113454014/modules/4fd8d440-9428-4de7-93c0-4dca17a36700/lessons/8304370457/concepts/83061122970923#
var map = self.googleMap;

var locationData = [
  {
    locationName: 'Homestead',
    latLng: {lat: 37.826058, lng: -122.253213},
    id : 'ChIJvzf2ODp-j4ARFdkUw7a_nTw'
  },

  {
    locationName: 'Central Kitchen',
    latLng: {lat: 37.759191, lng: -122.411053},
    id : 'ChIJr-EMFjd-j4ARHKaF3ehlmgY'
  },

  {
    locationName: 'Abbot\'s Cellar',
    latLng: {lat: 37.761071, lng: -122.421882},
    id : 'ChIJu0_1IT1-j4ARDc5-8cFyQUk'
  }
];


var KoViewModel = function() {
  var self = this;
  // Create a styles array to use with the map.
  // var styledMapType = new google.maps.StyledMapType(
  // [
   var styles = [
  {
   "elementType": "labels.text.fill",
   "stylers": [
     {"visibility": "on"},
     { "saturation": -76 },
     { "color": "#f0560b" },
     { "weight": 0.1 }
   ]
  },
  {
   "featureType": "landscape.natural",
   "stylers": [
     {"visibility": "on"},
     { "saturation": -28 },
     // { "color": "#32302f" },
     { "color": "#e5e3df" }
   ]
  },
  {
   "featureType": "poi",
   "stylers": [
     {"visibility": "on"},
     // { "color": "#808080" },
     { "color": "#e5e3df" }
   ]
  },
  {
   "elementType": "labels.text.stroke",
   "stylers": [
     { "weight": 0.5 },
     { "saturation": -71 },
     { "color": "#f0560b" }
   ]
  },{
   "featureType": "road",
   "elementType": "geometry",
   "stylers": [
     { "color": "#ffffff"}
   ]
  },
   {
   "featureType": "landscape",
   "stylers": [
     { "visibility": "on" },
     { "color": "#e5e3df" }
   ]
  },
  {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#e3e3e3"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 0
            },
            {
                "visibility": "on"
            }
        ]
    },
  {
   "featureType": "water",
   "elementType": "all",
   "stylers": [
       {"color": "#ffffff"},
       {"visibility": "on"}
     ]
   }
 ];
  // ,
  // {name:'styled map'});

  // Build the Google Map object. Store a reference to it.
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.760098, lng: -122.426842},
    zoom: 13,
    styles: styles
    // mapTypeControlOptions: {
    // mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']
    // }
  });
  //Associate the styled map with the MapTypeId and set it to display.
  // self.map.mapTypes.set('styled_map', self.styledMapType);
  // map.setMapTypeId('styled_map');

  var largeInfowindow = new google.maps.InfoWindow();
  // Build "Place" objects out of raw place data. It is common to receive place
  // data from an API like FourSquare. Place objects are defined by a custom
  // constructor function you write, which takes what you need from the original
  // data and also lets you add on anything else you need for your app, not
  // limited by the original data.
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('808080');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('f0560b');

  var butterIcon = {
    url: 'images/butter2.svg',
    //state your size parameters in terms of pixels
    size: new google.maps.Size(70, 60),
    scaledSize: new google.maps.Size(70, 60),
    origin: new google.maps.Point(0,0)
    };

  // Build Markers via the Maps API and place them on the map.
  self.allPlaces.forEach(function(place) {
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng,
      animation: google.maps.Animation.DROP,
      // icon: defaultIcon,
      icon: butterIcon,
      // must use optimized false for CSS
      optimized: false,
      title: place.locationName,
      placeId: place.placeId
    };

    // var myoverlay = new google.maps.OverlayView();
    //   myoverlay.draw = function () {
    //       this.getPanes().markerLayer.id='markerLayer';
    //   };
    // myoverlay.setMap(map);


    place.marker = new google.maps.Marker(markerOptions);

    // You might also add listeners onto the marker, such as "click" listeners.
    // place.marker.addListener('click', function() {
    //   populateInfoWindow(this, largeInfowindow);
    // });

    // You might also add listeners onto the marker, such as "click" listeners.
    place.marker.addListener('click', function() {
      getPlacesDetails(this, largeInfowindow);
    });



    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    place.marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    place.marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  });


  // This array will contain what its name implies: only the markers that should
  // be visible based on user input. My solution does not need to use an
  // observableArray for this purpose, but other solutions may require that.
  self.visiblePlaces = ko.observableArray();


  // All places should be visible at first. We only want to remove them if the
  // user enters some input which would filter some of them out.
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });


  // This, along with the data-bind on the <input> element, lets KO keep
  // constant awareness of what the user has entered. It stores the user's
  // input at all times.
  self.userInput = ko.observable('');


  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain
  // visible. All other markers are removed.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    self.visiblePlaces.removeAll();
    // This looks at the name of each places and then determines if the user
    // input can be found within the place name.
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);

      if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });


    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);

    });
  };

  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'images/butter2.svg'+ markerColor +
      '|40|_|%E2%80%A2',
      // 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      // '|40|_|%E2%80%A2',
      new google.maps.Size(70, 60),
      new google.maps.Point(0, 0),
      new google.maps.Point(35, 60),
      new google.maps.Size(70,60));
    return markerImage;
  }


  function Place(dataObj) {
    this.placeId = dataObj.id;
    this.locationName = dataObj.locationName;
    this.latLng = dataObj.latLng;

    // You will save a reference to the Places' map marker after you build the
    // marker:
    this.marker = null;
  }
  function getPlacesDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId: marker.placeId
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Set the marker property on this infowindow so it isn't created again.
        infowindow.marker = marker;
        var innerHTML = '<div>';
        if (place.name) {
          innerHTML += '<strong>' + place.name + '</strong>';
        }
        if (place.formatted_address) {
          innerHTML += '<br>' + place.formatted_address;
        }
        if (place.formatted_phone_number) {
          innerHTML += '<br>' + place.formatted_phone_number;
        }
        if (place.opening_hours) {
          innerHTML += '<br><br><strong>Hours:</strong><br>' +
              place.opening_hours.weekday_text[0] + '<br>' +
              place.opening_hours.weekday_text[1] + '<br>' +
              place.opening_hours.weekday_text[2] + '<br>' +
              place.opening_hours.weekday_text[3] + '<br>' +
              place.opening_hours.weekday_text[4] + '<br>' +
              place.opening_hours.weekday_text[5] + '<br>' +
              place.opening_hours.weekday_text[6];
        }
        if (place.photos) {
          innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
    });
  }

};

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

function getPlacesDetails(marker, infowindow) {
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: place.placeId
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Set the marker property on this infowindow so it isn't created again.
      infowindow.marker = marker;
      var innerHTML = '<div>';
      if (place.name) {
        innerHTML += '<strong>' + place.name + '</strong>';
      }
      if (place.formatted_address) {
        innerHTML += '<br>' + place.formatted_address;
      }
      if (place.formatted_phone_number) {
        innerHTML += '<br>' + place.formatted_phone_number;
      }
      if (place.opening_hours) {
        innerHTML += '<br><br><strong>Hours:</strong><br>' +
            place.opening_hours.weekday_text[0] + '<br>' +
            place.opening_hours.weekday_text[1] + '<br>' +
            place.opening_hours.weekday_text[2] + '<br>' +
            place.opening_hours.weekday_text[3] + '<br>' +
            place.opening_hours.weekday_text[4] + '<br>' +
            place.opening_hours.weekday_text[5] + '<br>' +
            place.opening_hours.weekday_text[6];
      }
      if (place.photos) {
        innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
            {maxHeight: 100, maxWidth: 200}) + '">';
      }
      innerHTML += '</div>';
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  });
}

ko.applyBindings(new KoViewModel());
