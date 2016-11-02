// adapted from http://codepen.io/prather-mcs/pen/KpjbNN
// and from https://classroom.udacity.com/nanodegrees/nd001/parts/00113454014/modules/4fd8d440-9428-4de7-93c0-4dca17a36700/lessons/8304370457/concepts/83061122970923#
// var map;
// "use strict";
var map = self.googleMap;
var errorSVG = document.getElementById("errorDiv");
var locationData = [{
	locationName: 'Homestead',
	latLng: {
		lat: 37.826058,
		lng: -122.253213
	},
	id: 'ChIJvzf2ODp-j4ARFdkUw7a_nTw'
}, {
	locationName: 'Central Kitchen',
	latLng: {
		lat: 37.759191,
		lng: -122.411053
	},
	id: 'ChIJr-EMFjd-j4ARHKaF3ehlmgY'
}, {
	locationName: 'Tartine Bakery',
	latLng: {
		lat: 37.761646,
		lng: -122.424114
	},
	id: 'ChIJBVY2Bxh-j4ARa2zO8Jd6H2A'
}, {
	locationName: '25 Lusk',
	latLng: {
		lat: 37.778598,
		lng: -122.394331
	},
	id: 'ChIJAzkmQNZ_j4ARs6PNLtDYE_g'
}, {
	locationName: 'Causwells',
	latLng: {
		lat: 37.800545,
		lng: -122.442035
	},
	id: 'ChIJ78j3OdSAhYAR_nZU8ILRNUU'
}];
var styles = [{
	"elementType": "labels.text.fill",
	"stylers": [{
		"visibility": "on"
	}, {
		"saturation": -76
	}, {
		"color": "#f0560b"
	}, {
		"weight": 0.1
	}]
}, {
	"featureType": "landscape.natural",
	"stylers": [{
			"visibility": "on"
		}, {
			"saturation": -28
		},
		// { "color": "#32302f" },
		{
			"color": "#e5e3df"
		}
	]
}, {
	"featureType": "poi",
	"stylers": [{
			"visibility": "on"
		},
		// { "color": "#808080" },
		{
			"color": "#e5e3df"
		}
	]
}, {
	"elementType": "labels.text.stroke",
	"stylers": [{
		"weight": 0.5
	}, {
		"saturation": -71
	}, {
		"color": "#f0560b"
	}]
}, {
	"featureType": "road",
	"elementType": "geometry",
	"stylers": [{
		"color": "#ffffff"
	}]
},
  {
    "featureType": "road.highway",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
	"featureType": "landscape",
	"stylers": [{
		"visibility": "on"
	}, {
		"color": "#e5e3df"
	}]
}, {
	"featureType": "landscape",
	"elementType": "geometry",
	"stylers": [{
		"hue": "#e3e3e3"
	}, {
		"saturation": -100
	}, {
		"lightness": 0
	}, {
		"visibility": "on"
	}]
}, {
	"featureType": "water",
	"elementType": "all",
	"stylers": [{
		"color": "#ffffff"
	}, {
		"visibility": "on"
	}]
}];


var koViewModel = function() {
	var self = this;
	
	self.listViewClick = function(marker, infowindow) {
	locLat = this.latLng.lat;
	locLng = this.latLng.lng;
	map.setZoom(15);
	map.panTo(this.latLng);
	google.maps.event.trigger(this.marker, 'click');
	}; //end listViewClick
	
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
	// var defaultIcon = makeMarkerIcon('808080');
	var defaultIcon = {
		url: 'images/butter.png',
	};

	var highlightedIcon = {
		url: 'images/butter2.png',
	};

	// Build Markers via the Maps API and place them on the map.
	self.allPlaces.forEach(function(place) {
		var markerOptions = {
			map: map,
			position: place.latLng,
			lat: place.latLng.lat,
			lng: place.latLng.lng,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			title: place.locationName,
			placeId: place.placeId,
		};
		place.marker = new google.maps.Marker(markerOptions);
		// You might also add listeners onto the marker, such as "click" listeners.
		// place.marker.addListener('click', function() {
		//   populateInfoWindow(this, largeInfowindow);
		// });
		place.marker.addListener('click', function() {
			getPlacesDetails(this, largeInfowindow);
			locLat = this.lat;
			locLng = this.lng;
			self.allWikiTitles("Cool things near " + this.title);
			// clear location list
			self.allWikiArticles([]);
			var hashtag = locLat + '%7C' + locLng;
			var completeWikiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=" + hashtag + "&gsradius=10000&gslimit=5";
			var _list = $('.link-list');
			$.ajax({
				url: completeWikiUrl,
				dataType: "jsonp",
				jsonp: "callback",
				success: function(response) {
					var articleList = response.query.geosearch;
					for(var i = 0; i < articleList.length; i++) {
						var article = articleList[i];
						self.allWikiArticles.push(article); // push articles to observable array				
					}
					var attribution = document.getElementById("attribution").innerHTML =('Nearby attractions brought to you by Wikimedia.');
				}, //end success function
				error: function(response) {
					console.log('Oops...API did not load');
				}
			}); //end AJAX call
		}); //end place.marker.addListener
		
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
			if(place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
				self.visiblePlaces.push(place);
			}
		});
		self.visiblePlaces().forEach(function(place) {
			place.marker.setVisible(true);
		});
	};
	self.wikiArticles = ko.observableArray();
	var allWikiArticles = [];
	self.allWikiArticles = ko.observableArray();
	allWikiArticles.forEach(function(article) {
		self.wikiArticles.push(article);
	});
		
	self.allWikiTitles = ko.observableArray();
	var allWikiTitles =[];
}; //end koViewModel

function Place(dataObj) {
	this.placeId = dataObj.id;
	this.locationName = dataObj.locationName;
	this.latLng = dataObj.latLng;
	// You will save a reference to the Places' map marker after you build the
	// marker:
	this.marker = null;
}
var mapInit = function() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 37.798814,
			lng: -122.381601
		},
		zoom: 11,
		styles: styles,
		mapTypeControl: false
	});
	// as per https://discussions.udacity.com/t/async-google-map-broke-my-app/42765/8
	// and https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282
	var googleMap = map;
	ko.applyBindings(new koViewModel(googleMap, locationData));
};
var googleError = function(onerror) {
	//  Mozilla recommendes you not use innerHTML when inserting plain text; instead, use node.textContent. This doesn't interpret the passed content as HTML, but instead inserts it as raw text.
	//https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
	errorSVG.textContent = ('Oops...Map did not load');
	console.log('Oops...map did not load');
	errorSVG.innerHTML = "<img src='images/noMap.svg' alt='Map failed to load'/>";
};

function getPlacesDetails(marker, infowindow) {
	var service = new google.maps.places.PlacesService(map);
	service.getDetails({
		placeId: marker.placeId
	}, function(place, status) {
		if(status === google.maps.places.PlacesServiceStatus.OK) {
			// Set the marker property on this infowindow so it isn't created again.
			infowindow.marker = marker;
			infowindow.marker.addListener('click', toggleBounce);
			console.log("getPlacesDetails if " + place.name);
			var innerHTML = '<div class=info-windows>';
			if(place.name) {
				innerHTML += '<strong>' + place.name + '</strong>';
			}
			if(place.formatted_address) {
				innerHTML += '<br>' + place.formatted_address;
			}
			if(place.formatted_phone_number) {
				innerHTML += '<br>' + place.formatted_phone_number;
			}
			if(place.opening_hours) {
				innerHTML += '<br><br><strong>Hours:</strong><br>' + place.opening_hours.weekday_text[0] + '<br>' + place.opening_hours.weekday_text[1] + '<br>' + place.opening_hours.weekday_text[2] + '<br>' + place.opening_hours.weekday_text[3] + '<br>' + place.opening_hours.weekday_text[4] + '<br>' + place.opening_hours.weekday_text[5] + '<br>' + place.opening_hours.weekday_text[6];
			}
			if(place.photos) {
				innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
					maxHeight: 100,
					maxWidth: 200
				}) + '">' + '<p>hover over image</p>';
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
	// adapted from https://developers.google.com/maps/documentation/javascript/examples/marker-animations?hl=de
	function toggleBounce() {
		if(marker.getAnimation() !== null) {
			marker.setAnimation(null);
			console.log("ToggleBounce if " + marker.title);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			console.log("ToggleBounce else " + marker.title);
			setTimeout(function() {
				marker.setAnimation(null);
			}, 1400);
		}
	}
}
