var data = require('data');
//alert(data.places.length);
//var placestoshow = ["place1", "place2", "place3", "place4", "place5", "place6", "place7", "place8", "place8", "place9"];
var count = 0;
var place = {
	state : "",
	cities : [],
	lat:0,
	lng:0
};
var  flag=false;
//alert(data.places.length);
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
			place.lat = myLat;
			place.lng = myLon;
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
						count = 0;
						$.label1.hide();
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
var selectedRow;
(function checkSelectedrow(){
	alert('****'+$.table.data.length);
})();

var placesSelected = $.table.placesSelected || [];
function selectPlace(e) {
	selectedRow = e.row;
	flag=true;
	if (selectedRow.isMilestone) {
		selectedRow.setBackgroundColor("light gray");
		selectedRow.isMilestone = false;
		count--;
		for (var i = 0; i <= placesSelected.length; i++) {
			if (placesSelected[i] == selectedRow) {
				placesSelected.splice(i, 1);
				//alert('removed::' + placesSelected.length);
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
		//alert('added::' + placesSelected.length);
		if (count >= 1) {
			$.label1.show();
			$.label1.setText("Selected Places:" + count);
		} else {
			$.label1.hide();
		}
	}
$.table.placesSelected = placesSelected;
}

function createRoute(e) {
	$.dialog.show();
};

$.dialog.addEventListener('click', function(e) {
	if (e.index == 1) {
		$.dailogtextfield.value = "";
	} else {
		$.dailogtextfield.value = "";
		Alloy.createController('/MyRoute', {places: placesSelected, city: {latitude: place.lat, longitude: place.lng}}).getView().open();
		$.dialog.hide();
	}
});
$.index.addEventListener('focus',function(e){
	//placesSelected.splice(0,placesSelected.length);
	//alert(placesSelected.length);
	/*
	if(flag==true){
			selectedRow.setBackgroundColor("light gray");
			selectedRow.isMilestone = false;
			 count = 0;
		}*/
	
	
});
$.index.open();
