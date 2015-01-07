var params = arguments[0] || {};


var annotations = [];
var Map = require('ti.map');
var mapview = Map.createView({
	mapType : Map.NORMAL_TYPE,
	animate: true,
	region:{
		latitude:params.city.latitude,
		longitude:params.city.longitude
	}
});
//alert(JSON.stringify(params.places));
for(var i=0;i < params.places.length;i++){
	var annotation1 = Map.createAnnotation({
					latitude : params.places[i].latitude,
					longitude : params.places[i].longitude,
					animate: true,
					pincolor : Ti.Map.ANNOTATION_GREEN,
					title:params.places[i].title
				});
				annotations.push(annotation1);
				mapview.addAnnotations(annotations);
}


var milestones = ["MS1:Place2", "MS2:Place1", "MS3:Place3", "MS4:Place6", "MS5:Place7", "MS6:Place4", "MS7:Place5"];
var milestoneArray = [];
for ( i = 0; i < milestones.length; i++) {
	var tableviewrow = Ti.UI.createTableViewRow({
		title : milestones[i],
		color : 'black',
		//height:'2%'
	});
	milestoneArray.push(tableviewrow);
}
$.table.data = milestoneArray;
$.mapView.add(mapview);
//$.MyRoute.open();