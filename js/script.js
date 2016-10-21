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
self.listViewClick = function(marker, infowindow) {
	// console.log(Place);
	// console.log("This is working with: " + this.locationName);
	// console.log("This marker is : " + this.latLng.lat);
	// var locLat = this.latLng.lat;
	locLat = this.latLng.lat;
	locLng = this.latLng.lng;
	// name = title;
	// console.log("This name: " + name);
	// console.log("This Lng : " + locLng);
	map.setZoom(15);
	map.panTo(this.latLng);
	google.maps.event.trigger(this.marker, 'click');
}; //end listViewClick
var koViewModel = function() {
	var locLat = [];
	var locLng = [];
	// console.log(locLat);
	var self = this;
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
		url: 'images/butter2.svg',
	};
	// var defaultIcon = butterIcon;
	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	// var highlightedIcon = makeMarkerIcon('f0560b');
	var highlightedIcon = {
		url: 'images/butter.svg',
	};
	// var butterIcon = {
	//   url: 'images/butter2.svg',
	//   //state your size parameters in terms of pixels
	//   size: new google.maps.Size(15, 20),
	//   scale: 0.5,
	//   scaledSize: new google.maps.Size(5, 30),
	//   origin: new google.maps.Point(0,0)
	//   };
	// Build Markers via the Maps API and place them on the map.
	self.allPlaces.forEach(function(place) {
		var markerOptions = {
			map: map,
			position: place.latLng,
			lat: place.latLng.lat,
			lng: place.latLng.lng,
			animation: google.maps.Animation.DROP,
			// icon: butterIcon,
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
			// console.log(locLat);
			// // var attraction1 = new google.maps.LatLng(locLat, locLng);
			// // console.log(attraction1);
			//  var amsterdam = new google.maps.LatLng(37.826058,-122.253213);
			//  var london = new google.maps.LatLng(37.759191, -122.411053);
			//  //
			//  var mapCanvas = document.getElementById("map");
			// //  var mapOptions = {center: amsterdam, zoom: 4};
			//  var map = new google.maps.Map(mapCanvas);
			//  //
			//  var flightPath = new google.maps.Polyline({
			//    path: [london, amsterdam],
			//    strokeColor: "#0000FF",
			//    strokeOpacity: 0.8,
			//    strokeWeight: 2
			//  });
			//  flightPath.setMap(map);
			// self.allWikiTitles.push = (this.title);
			var wikiTitle = document.getElementById('wikiTitle');
			wikiTitle.textContent = (this.title);
			// console.log("This lat: " + this.lat);
			// console.log("This Lng : " + this.lng);
			var $wikiElem = $('#wikipedia-articles');
			$wikiElem.text("");
			var hashtag = locLat + '%7C' + locLng;
			var completeWikiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=" + hashtag + "&gsradius=10000&gslimit=5";
			var _list = $('.link-list');
			$.ajax({
				url: completeWikiUrl,
				dataType: "jsonp",
				jsonp: "callback",
				success: function(response) {
					// console.log(response);
					// var articleList = response.query.geosearch[0];
					// var articleList = response;
					var articleList = response.query.geosearch;
					// console.log(response.query.geosearch);
					// console.log(listViewClick.locLat);
					// console.log("This marker is : " + this.latLng.lat);
					// console.log(articleList);
					for(var i = 0; i < articleList.length; i++) {
						var article = articleList[i];
						// var wikiLat = (article.lat);
						// var wikiLng = (article.lon);
						// var wikiLatLng = ('article.lat' + 'article.lon');
						// console.log(wikiLatLng);
						// console.log(wikiLat);
						// console.log(wikiLng);
						//  console.log(listViewClick);
						// self.allWikiArticles.push(article);
						// var url = 'http://en.wikipedia.org/wiki/' + article;
						// $wikiElem.append('<li><a href="' + url + '">' + article + '</a></li>');
						// allWikiArticles.push(articleList[i].title);
						// var title = articleList[i].title;
						self.allWikiArticles.push(article); // push articles to observable array
						// console.log(title);
						// allWikiArticles.title(articleList[i].title);
						// allWikiArticles.dist(articleList[i].dist);
						//
						// console.log(articleList[i].title);
						// allWikiArticles['title'] = articleList[i].title;
						// allWikiArticles.title = articleList[i].title;
						// allWikiArticles.title = (this.title= title);
						// console.log(allWikiArticles.title); //  document.getElementById("list-Wiki").innerHTML =article;
						// $wikiElem.append('<li id="wikipedia-articles">'+
						// 		'<p class="atractionTitle"><strong>' +response.query.geosearch[i].title+'</strong></p>'+
						// 		'<p>' +'distance in meters: ' + response.query.geosearch[i].dist + '</p>'+
						// '</li>'+'<hr>');
						// self.allWikiArticles.push( response.query.geosearch[i].title);
						// self.allWikiArticles.push(articleList);
					}
					// clearTimeout(wikiRequestTimeout);
				}, //end success function
				error: function(response) {
					// console.log('error occured loading API');
					// errorSVG.textContent = ('Oops...Map did not load');
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
	// self.allWikiArticles = ko.observableArray();
	var allWikiArticles = [
		dogtitle = 'dog',
		dogName2 = 'dog2',
	];
	// var allWikiTitles =[];
	// console.log(allWikiArticles);
	self.allWikiArticles = ko.observableArray();
	allWikiArticles.forEach(function(article) {
		self.wikiArticles.push(article);
	});
	// console.log(this.wikiArticles[0]);
	// self.allWikiTitles = ko.observableArray();
	// 	allWikiTitles.forEach(function(title) {
	// 		self.wikiArticles.push(title);
	// 	});
	// console.log(allWikiTitles);
}; //end koViewModel
// var viewModel = {
//     firstName : ko.observable("Bert"),
//     lastName : ko.observable("Smith"),
//     pets : ko.observableArray(["Cat", "Dog", "Fish"]),
//     type : "Customer"
// };
// viewModel.hasALotOfPets = ko.computed(function() {
//     return this.pets().length > 2;
// }, viewModel);
// console.log(link);
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
	// var errorSVG = document.getElementById("errorDiv");
	//  Mozilla recommendes you not use innerHTML when inserting plain text; instead, use node.textContent. This doesn't interpret the passed content as HTML, but instead inserts it as raw text.
	//https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
	errorSVG.textContent = ('Oops...Map did not load');
	console.log('Oops...map did not load');
	errorSVG.innerHTML = "<img src='images/noMap.svg' alt='Map failed to load'/>";
};
// function populateInfoWindow(marker, infowindow) {
// 	// Check to make sure the infowindow is not already opened on this marker.
// 	if(infowindow.marker != marker) {
// 		// Clear the infowindow content to give the streetview time to load.
// 		infowindow.setContent('');
// 		infowindow.marker = marker;
// 		// Make sure the marker property is cleared if the infowindow is closed.
// 		infowindow.addListener('closeclick', function() {
// 			infowindow.marker = null;
// 		});
// 		var streetViewService = new google.maps.StreetViewService();
// 		var radius = 50;
// 		// In case the status is OK, which means the pano was found, compute the
// 		// position of the streetview image, then calculate the heading, then get a
// 		// panorama from that and set the options
// 		function getStreetView(data, status) {
// 			if(status == google.maps.StreetViewStatus.OK) {
// 				// var nearStreetViewLocation = data.location.latLng;
// 				var nearStreetViewLocation = data.location.latLng;
// 				var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
// 				infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
// 				var panoramaOptions = {
// 					position: nearStreetViewLocation,
// 					pov: {
// 						heading: heading,
// 						pitch: 30
// 					}
// 				};
// 				var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
// 			} else {
// 				infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>');
// 			}
// 		}
// 		// Use streetview service to get the closest streetview image within
// 		// 50 meters of the markers position
// 		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
// 		// Open the infowindow on the correct marker.
// 		infowindow.open(map, marker);
// 	}
// }
function getPlacesDetails(marker, infowindow) {
	var service = new google.maps.places.PlacesService(map);
	service.getDetails({
		placeId: marker.placeId
	}, function(place, status) {
		if(status === google.maps.places.PlacesServiceStatus.OK) {
			// Set the marker property on this infowindow so it isn't created again.
			infowindow.marker = marker;
			infowindow.marker.addListener('click', toggleBounce);
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
			// trying to prevent infowindow getting clipped: http://www.emanueletessore.com/google-maps-balloon-position/
			// infowindow.addListener('tilesloaded', map, function() {
			// 	infowindow.open(map,marker);
			// 	});
			// google.maps.event.addListener(map, 'tilesloaded', function() {
			// 	infowindow.open(map,marker);
			// 	});
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
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				marker.setAnimation(null);
			}, 1500);
		}
	}
}
