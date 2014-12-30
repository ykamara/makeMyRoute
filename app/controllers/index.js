var data = require('data');
//alert(data.places.length);
var placestoshow = ["place1", "place2", "place3", "place4", "place5", "place6", "place7", "place8", "place8", "place9"];
var place = {
	state : "",
	cities : []
};

//set text value for state
place.state = "Andaman & Nicobar Islands";

place.cities = _.pluck(data.places, 'TOWN');
//alert(JSON.stringify(place.cities));

var fillCities = function() {
	var cities = [];
	for (var i = 0; i < place.cities.length; i++) {
		var pickerRow = Ti.UI.createPickerRow({
			title : place.cities[i]
		});
		cities.push(pickerRow);
	}
	$.picker.add(cities);
};
fillCities();
var tabledata = [];
for ( i = 0; i < placestoshow.length; i++) {
	var tableviewrow = Ti.UI.createTableViewRow({
		title : placestoshow[i],
		color : 'black',
		//height:'2%'
	});
	tabledata.push(tableviewrow);
}
$.table.data = tabledata;
//$.picker.add(data);
$.addtomilestone.addEventListener('click',function(e){
	$.dialog.show();
	
});
$.dialog.addEventListener('click',function(e){
	if(e.index==1){
		$.dailogtextfield.value="";
	}else{
		$.dailogtextfield.value="";
		Alloy.createController('/MyRoute').getView().open();
		$.dialog.hide();
	}	
	});

var xhr = Ti.Network.createHTTPClient({
	onload: function (e){
		alert(this.responseText);
	},
	onsuccess: function (e){
		alert(e.error);
	}
});
var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=12.9,77.6&radius=621.37&key=AIzaSyA_sCSDoOYmJDgLOIn_x3p52Zyg1dHpBYE";

xhr.open('GET', url);
xhr.send();
	
$.index.open();
