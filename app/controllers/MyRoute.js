//var args = arguments[0] || {};
var Map = require('ti.map');
var mapview = Map.createView({
	mapType : Map.NORMAL_TYPE,
});
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