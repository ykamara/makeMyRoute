var data = require('data');
//alert(data.places.length);
var placestoshow = ["place1", "place2", "place3", "place4", "place5", "place6", "place7", "place8", "place8", "place9"];
var place = {
	state : "",
	cities : []
};

//set text value for state
place.state = "Andaman & Nicobar Islands";

function fetchCities(state) {
	var stateData = _.where(data.places, {
		STATE : "Punjab"
	});
	return _.uniq(_.pluck(stateData, 'DISTRICT'));
};

place.cities = fetchCities();

console.log("@@@@@ " + JSON.stringify(place.cities));

var fillCities = function() {
	var cities = [];
	
	for (var i = 0; i < place.cities.length; i++) {
		var pickerRow = Ti.UI.createPickerRow({
			title : place.cities[i]
		});
		cities.push(pickerRow);
	}
	$.cityPicker.add(cities);
};

function fillStates() {
	var pickerRow = Ti.UI.createPickerRow({
		title : "Punjab"
	});
	$.statePicker.add(pickerRow);
};

fillStates();
fillCities();
//$.picker.add(data);

function getLatLong(e) {
	var myAddress = e.selectedValue[0];
	var xhrGeocode = Ti.Network.createHTTPClient();
	//xhrGeocode.setTimeout(120000);
	xhrGeocode.onerror = function(e) {
		alert('Error occurred');
	};

	xhrGeocode.onload = function(e) {
		var response = JSON.parse(this.responseText);
		if (response.status == 'OK' && response.results != undefined && response.results.length > 0) {
			var myLat = response.results[0].geometry.location.lat;
			var myLon = response.results[0].geometry.location.lng;

			var xhr = Ti.Network.createHTTPClient({
				onload : function(e) {
					var response = this.responseText;
					alert(response);
					// var tabledata = [];
					// for ( i = 0; i < response.results.length; i++) {
						// var tableviewrow = Ti.UI.createTableViewRow({
							// title : response.results[i].name,
							// color : 'black',
							// //height:'2%'
						// });
						// tabledata.push(tableviewrow);
					// }
					// $.table.data = tabledata;
				},
				onerror : function(e) {

					alert(e.error);
				}
			});
			var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + myLat + "," + myLon + "&radius=50000&key=AIzaSyA_sCSDoOYmJDgLOIn_x3p52Zyg1dHpBYE";

			xhr.open('POST', url);
			xhr.send();
		}
	};
	var urlMapRequest = "http://maps.google.com/maps/api/geocode/json?address=" + myAddress.replace(' ', '+');
	urlMapRequest += "&sensor=" + (Ti.Geolocation.locationServicesEnabled == true);

	xhrGeocode.open("GET", urlMapRequest);
	xhrGeocode.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhrGeocode.send();

};

$.addtomilestone.addEventListener('click', function(e) {
	$.dialog.show();

});
$.dialog.addEventListener('click', function(e) {
	if (e.index == 1) {
		$.dailogtextfield.value = "";
	} else {
		$.dailogtextfield.value = "";
		Alloy.createController('/MyRoute').getView().open();
		$.dialog.hide();
	}
});

$.index.open();
