var data = require('data');
//alert(data.places.length);
//var placestoshow = ["place1", "place2", "place3", "place4", "place5", "place6", "place7", "place8", "place8", "place9"];

var place = {
	state : "",
	cities : []
};

alert(data.places.length);
function fetchCities(state) {
	var stateData = _.where(data.places, {
		STATE : "Karnataka"
	});
	console.log(" ARRAY "+stateData);
	return _.uniq(_.pluck(stateData, 'DISTRICT'));
};

place.cities = fetchCities();

console.log("@@@@@ " + JSON.stringify(place.cities));
var pickerRow1;
var fillCities = function() {
	var cities = [];
	pickerRow1 = Ti.UI.createPickerRow({
		title : 'Select City'
	});
	cities.push(pickerRow1);
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
		title : "Karnataka"
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
		//alert(JSON.stringify(response));
		//alert('first response::'+JSON.stringify(response));
		if (response.status == 'OK' && response.results != undefined && response.results.length > 0) {
			var myLat = response.results[0].geometry.location.lat;
			var myLon = response.results[0].geometry.location.lng;

			var xhr = Ti.Network.createHTTPClient({
				onload : function(e) {
					var response = JSON.parse(this.responseText);
					//alert(JSON.stringify(response));
					//alert("name::"+response.results[i].name);

					var tabledata = [];
					for (var i = 0; i < response.results.length; i++) {
						var tableviewrow = Ti.UI.createTableViewRow({
							title : response.results[i].name.toString(),
							color : 'black',
							latitude : response.results[i].geometry.location.lat,
							longitude : response.results[i].geometry.location.lng,
							isMilestone : false,
						});
						tabledata.push(tableviewrow);
					}
					$.table.data = tabledata;
				},
				onerror : function(e) {

					alert(e.error);
				}
			});
			var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + myLat + "," + myLon + "&types=hindu_temple|stadium|shopping_mall|place_of_worship&rankby=distance&key=AIzaSyA_sCSDoOYmJDgLOIn_x3p52Zyg1dHpBYE";
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
var placesSelected=[];
function selectPlace(e) {
	var selectedRow = e.row;
	//placesSelected.push
	if (selectedRow.isMilestone) {
		selectedRow.setBackgroundColor("light gray");
		selectedRow.isMilestone = false;
	} else {
		selectedRow.setBackgroundColor("cyan");
		selectedRow.isMilestone = true;
	}

}

function createRoute(e) {
	//alert("jkljhjk");
		$.dialog.show();
};

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
