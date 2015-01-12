/**
 * PARAMETERS
 **/
var data = require('data');
var count = 0;
var place = {
	state : "",
	cities : [],
	lat : 0,
	lng : 0
};
var flag = false;
var pickerRow1;
var selectedRow;
var placesSelected = [];

/**
 * HELPER METHODS
 **/
/**
 * function to get cities
 * @param {Object} state
 */
function fetchCities(state) {
	var stateData = _.where(data.places, {
		STATE : "Karnataka"
	});
	console.log(" ARRAY " + stateData);
	return _.uniq(_.pluck(stateData, 'DISTRICT'));
};
place.cities = fetchCities();

/**
 * Set city names in city
 */
function fillCities() {
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

/**
 * Function to get state
 */
function fillStates() {
	var pickerRow = Ti.UI.createPickerRow({
		title : "Karnataka"
	});
	$.statePicker.add(pickerRow);
};

/**
 * EVENT LISTENERS
 */
/**
 * Function to get places nearby the selected city
 */
function getLatLong(e) {
	var myAddress = e.selectedValue[0];
	var xhrGeocode = Ti.Network.createHTTPClient();
	xhrGeocode.onerror = function(e) {
		alert('Error occurred');
	};

	xhrGeocode.onload = function(e) {
		var response = JSON.parse(this.responseText);
		if (response.status == 'OK' && response.results != undefined && response.results.length > 0) {
			var myLat = response.results[0].geometry.location.lat;
			var myLon = response.results[0].geometry.location.lng;
			place.lat = myLat;
			place.lng = myLon;
			var xhr = Ti.Network.createHTTPClient({
				onload : function(e) {
					var response = JSON.parse(this.responseText);
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
						count = 0;
						$.label1.hide();
					}
					$.table.data = tabledata;
				},
				onerror : function(e) {

					alert(e.error);
				}
			});

			// API to get the near by placeses of the selected city
			var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + myLat + "," + myLon + "&types=hindu_temple|stadium|shopping_mall|place_of_worship&rankby=distance&key=AIzaSyA_sCSDoOYmJDgLOIn_x3p52Zyg1dHpBYE";
			xhr.open('POST', url);
			xhr.send();
		}
	};

	//API to get the lat and long of the selected city
	var urlMapRequest = "http://maps.google.com/maps/api/geocode/json?address=" + myAddress.replace(' ', '+');
	urlMapRequest += "&sensor=" + (Ti.Geolocation.locationServicesEnabled == true);

	xhrGeocode.open("GET", urlMapRequest);
	xhrGeocode.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhrGeocode.send();

};

/**
 * Function to create route using selected places
 */
function createRoute(e) {
	if(count==0){
		alert("Select Atleast One Places");
	}else{
		$.dialog.show();
	}
	
};

/**
 * Function to select/deselect place and get its details
 * @param {Object} e
 */
function selectPlace(e) {
	selectedRow = e.row;
	flag = true;
	if (selectedRow.isMilestone) {
		selectedRow.setBackgroundColor("light gray");
		selectedRow.isMilestone = false;
		count--;
		for (var i = 0; i <= placesSelected.length; i++) {
			if (placesSelected[i] == selectedRow) {
				placesSelected.splice(i, 1);
			}
		}
		if (count >= 1) {
			$.label1.show();
			$.label1.setText("Selected Places:" + count);
		} else {
			$.label1.hide();
		}
	} else {

		selectedRow.setBackgroundColor("cyan");
		selectedRow.isMilestone = true;
		count++;
		$.label1.setText("Selected Places:" + count);
		placesSelected.push(selectedRow);
		if (count >= 1) {
			$.label1.show();
			$.label1.setText("Selected Places:" + count);
		} else {
			$.label1.hide();
		}
	}
}

/**
 * Function to enter route name
 */
$.dialog.addEventListener('click', function(e) {
	if (e.index == 1) {
		$.dailogtextfield.value = "";
	} else {
		$.dailogtextfield.value = "";
		Alloy.createController('/MyRoute', {
			places : placesSelected,
			city : {
				latitude : place.lat,
				longitude : place.lng
			}
		}).getView().open();
		$.dialog.hide();
	}
});

/**
 * INITIALIZATION LOGIC
 */

fillStates();
fillCities();
$.index.open();

