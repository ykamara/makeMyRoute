var params = arguments[0] || {};
var currentlat;
var currentlon;
var currentname;
var annotations = [];
var routePoints = [];
var milestoneArray = [];
var Map = require('ti.map');
var mapview = Map.createView({
	mapType : Map.NORMAL_TYPE,
	animate : true,
	regionFit : true,

	//zoom:50
});

function zoomToRegion(mapPoints) {
	var poiCenter = {};
	var delta = 0.02;
	var minLat = mapPoints[0].latitude, maxLat = mapPoints[0].latitude, minLon = mapPoints[0].longitude, maxLon = mapPoints[0].longitude;

	for (var i = 0; i < mapPoints.length - 1; i++) {
		minLat = Math.min(mapPoints[i + 1].latitude, minLat);
		maxLat = Math.max(mapPoints[i + 1].latitude, maxLat);
		minLon = Math.min(mapPoints[i + 1].longitude, minLon);
		maxLon = Math.max(mapPoints[i + 1].longitude, maxLon);
	}

	var deltaLat = maxLat - minLat;
	var deltaLon = maxLon - minLon;

	delta = Math.max(deltaLat, deltaLon);
	//delta = delta * 0.55;

	//poiCenter.lat = maxLat - parseFloat((maxLat - minLat) / 2);
	//poiCenter.lon = maxLon - parseFloat((maxLon - minLon) / 2);

	var region = {
		latitude : params.city.latitude,
		longitude : params.city.longitude,
		latitudeDelta : delta,
		longitudeDelta : delta
	};
	return region;
};
//alert(params.places.length);
for (var i = 0; i < params.places.length; i++) {

	var annotation1 = Map.createAnnotation({
		latitude : params.places[i].latitude,
		longitude : params.places[i].longitude,
		animate : true,
		pincolor : Ti.Map.ANNOTATION_GREEN,
		title : params.places[i].title
	});
	annotations.push(annotation1);
	mapview.addAnnotations(annotations);

	mapview.region = zoomToRegion(params.places);
}
function getLocation() {
	if (Ti.Network.online) {
		Ti.Geolocation.purpose = "Receive User Location";
		Titanium.Geolocation.getCurrentPosition(function(e) {
			//currentlat = 34.65;
			//currentlon = 27.67;
			if (!e.success || e.error) {
				alert('Could not find the device location');
				return;
			} else {
				//var annotations = [];
				currentlat = e.coords.latitude;
				currentlon = e.coords.longitude;
				//alert("lat:::" + currentlat + "lon:::" + currentlon);
				var annotation1 = Map.createAnnotation({
					latitude : currentlat,
					longitude : currentlon,
					//animate: true,
					pincolor : Map.ANNOTATION_GREEN,
				});
				Ti.Geolocation.reverseGeocoder(currentlat, currentlon, function(address) {

					//console.log("@@@@@@@@@@@@@@@@@@ " + JSON.stringify(address));
					//alert(address.places[0].displayAddress);

					var addrs;
					addrs = address.places[0].displayAddress;
					addrs = addrs.split(",");
					//alert('addrs:'+addrs);
					addrs.pop();
					addrs.pop();
					//alert("showww:"+addrs.toString());
					annotation1.title = addrs.toString();
					currentname=annotation1.title;
				});
				//getcurrentPosition(currentlat, currentlon,currentname);
				setRoutePoints(currentlat, currentlon,currentname);
				annotations.push(annotation1);
				mapview.addAnnotations(annotations);
			}
		});
	} else {
		alert("Internet connection is required to use localization features");
	}
};

function calDist(cLat, cLon, lt, ln) {
	//alert("clat::" + cLat + "cLon::" + cLon + "lt::" + lt + "ln::" + ln);
	var distance = 3959 * Math.acos(Math.cos((cLat * Math.PI) / 180) * Math.cos((lt * Math.PI) / 180) * Math.cos((ln * Math.PI) / 180 - (cLon * Math.PI) / 180) + Math.sin((cLat * Math.PI) / 180) * Math.sin((lt * Math.PI) / 180));
	distance = Math.round((distance * 100)) / 100;
	var kms = distance * 1.609;
	//alert('kms:::' + Math.round(kms));
	return kms;
};

function getRoute(currentlat, currentlon,currentname) {
	var source = {
		latitude : currentlat,
		longitude : currentlon,
		name :currentname
	};
	if (params.places.length > 1) {
		for (var i = 0; i < params.places.length - 1; i++) {

			var point1 = calDist(currentlat, currentlon, params.places[i].latitude, params.places[i].longitude);
			var point2 = calDist(currentlat, currentlon, params.places[i + 1].latitude, params.places[i + 1].longitude);
			if (point1 >= point2) {
				source.latitude = params.places[i].latitude;
				source.longitude = params.places[i].longitude;
				source.name = params.places[i].title;
			} else {
				source.latitude = params.places[i + 1].latitude;
				source.longitude = params.places[i + 1].longitude;
				source.name = params.places[i+1].title;
			}
		}
		//source=  Math.min(calDist(currentlon,currentlon,params.places[i].latitude,params.places[i].longitude),calDist(currentlon,currentlon,params.places[i+1].latitude,params.places[i+1].longitude));
	} else {
		source.latitude = params.places[0].latitude;
		source.longitude = params.places[0].longitude;
		source.name = params.places[0].title;
	}
	console.log("^^^^^ SOURCE " + JSON.stringify(source));
	return source;
}

function findAndRemove(array, searchValue) {
	_.each(array, function(data, idx) {
		if (data.latitude == searchValue.latitude) {
			array.splice(idx, 1);
		}
	});
	return array;
}

function setRoutePoints(currentlat, currentlon, currentname) {
	routePoints.push({
		latitude : currentlat,
		longitude : currentlon,
		name: currentname
	});
	//alert("lat:::*****" + currentlat + "lon:::****" + currentlon);
	var len = params.places.length;
	for (var i = 0; i < len; i++) {

		var routePoint = getRoute(currentlat, currentlon,currentname);
		currentlat = routePoint.latitude;
		currentlon = routePoint.longitude;
		currentname=routePoint.name;
		routePoints.push(routePoint);
		params.places = findAndRemove(params.places, routePoint);
		//console.log("****** " + JSON.stringify(params.places));
		//console.log("ARRAY LENGTH---- " + params.places.length);
	}
	//console.log("MY FINAL ARRAY-----  " + JSON.stringify(routePoints));
	alert("MY FINAL ARRAY-----  " + JSON.stringify(routePoints));
	markMilestone(routePoints);
};

//var milestones = ["MS1:Place2", "MS2:Place1", "MS3:Place3", "MS4:Place6", "MS5:Place7", "MS6:Place4", "MS7:Place5"];
function markMilestone(routePoints){
	
	for ( i = 1; i < routePoints.length; i++) {
	var tableviewrow = Ti.UI.createTableViewRow({
		title :routePoints[i].name,
		color : 'black',
		//height:'2%'
	});
	milestoneArray.push(tableviewrow);
}
}

getLocation();
function modifyRoute(){
	$.MyRoute.close();
}
$.table.data = milestoneArray;
$.mapView.add(mapview);
//$.MyRoute.open();