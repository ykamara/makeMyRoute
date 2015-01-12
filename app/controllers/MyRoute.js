/**
 * PARAMETERS
 **/
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

/**
 * HELPER METHODS
 **/
/**
 * function to zoom to the selected regions
 * @param {Object} state
 */
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

for (var i = 0; i < params.places.length; i++) {

	var annotation1 = Map.createAnnotation({
		latitude : params.places[i].latitude,
		longitude : params.places[i].longitude,
		animate : true,
		pincolor : Ti.Map.ANNOTATION_GREEN,
		title : params.places[i].title
	});
	annotations.push(annotation1);

}
/**
 * function to get current lat and current lon
 * @param {Object} state
 */

function getLocation() {
	if (Ti.Network.online) {
		Ti.Geolocation.purpose = "Receive User Location";
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				alert('Could not find the device location');
				return;
			} else {
				currentlat = e.coords.latitude;
				currentlon = e.coords.longitude;
				var annotation1 = Map.createAnnotation({
					latitude : currentlat,
					longitude : currentlon,
					pincolor : Map.ANNOTATION_GREEN,
				});
				var addrs;
				Ti.Geolocation.reverseGeocoder(currentlat, currentlon, function(address) {

					addrs = address.places[0].displayAddress;
					addrs = addrs.split(",");
					addrs.pop();
					addrs.pop();
					annotation1.title = addrs.toString();
					currentname = addrs.toString();
					//alert("Clatitude::" + currentlat + "Clongitude::" + currentlon + "Cname::" + currentname);
				});
				setRoutePoints(currentlat, currentlon, currentname);
				//console.log("Clatitude::"+currentlat+"Clongitude::"+currentlon+"Cname::"+currentname);
				annotations.push(annotation1);
				mapview.addAnnotations(annotations);
			}
		});
	} else {
		alert("Internet connection is required to use localization features");
	}
};
/**
 * function to calculate the distance between two points
 * @param {Object} state
 */
function calDist(cLat, cLon, lt, ln) {
	var distance = 3959 * Math.acos(Math.cos((cLat * Math.PI) / 180) * Math.cos((lt * Math.PI) / 180) * Math.cos((ln * Math.PI) / 180 - (cLon * Math.PI) / 180) + Math.sin((cLat * Math.PI) / 180) * Math.sin((lt * Math.PI) / 180));
	distance = Math.round((distance * 100)) / 100;
	var kms = distance * 1.609;
	return kms;
};

/**
 * function to get the optimized route
 * @param {Object} state
 */
function getRoute(currentlat, currentlon, currentname) {
	var source = {
		latitude : currentlat,
		longitude : currentlon,
		name : currentname
	};
	if (params.places.length > 1) {
		for (var i = 0; i < params.places.length - 1; i++) {

			var point1 = calDist(currentlat, currentlon, params.places[i].latitude, params.places[i].longitude);
			var point2 = calDist(currentlat, currentlon, params.places[i + 1].latitude, params.places[i + 1].longitude);
			if (point1 < point2) {
				source.latitude = params.places[i].latitude;
				source.longitude = params.places[i].longitude;
				source.name = params.places[i].title;
			} else {
				source.latitude = params.places[i + 1].latitude;
				source.longitude = params.places[i + 1].longitude;
				source.name = params.places[i + 1].title;
			}
		}
	} else {
		source.latitude = params.places[0].latitude;
		source.longitude = params.places[0].longitude;
		source.name = params.places[0].title;
	}
	console.log("^^^^^ SOURCE " + JSON.stringify(source));
	return source;
}

/**
 * function to to remove the source point
 * @param {Object} state
 */
function findAndRemove(array, searchValue) {
	_.each(array, function(data, idx) {
		if (data.latitude == searchValue.latitude) {
			array.splice(idx, 1);
		}
	});
	return array;
}

/**
 * function to set the route point(source)
 * @param {Object} state
 */
function setRoutePoints(currentlat, currentlon, currentname) {
	routePoints.push({
		latitude : currentlat,
		longitude : currentlon,
		name : currentname
	});
	var len = params.places.length;
	for (var i = 0; i < len; i++) {

		var routePoint = getRoute(currentlat, currentlon, currentname);
		currentlat = routePoint.latitude;
		currentlon = routePoint.longitude;
		currentname = routePoint.name;
		routePoints.push(routePoint);
		params.places = findAndRemove(params.places, routePoint);
	}
	markMilestone(routePoints);
	//console.log('******'+JSON.stringify(routePoints));
	//alert("************" + JSON.stringify(routePoints));
};

/**
 * EVENT LISTENERS
 */
/**
 * Function to create the tableviewrows in table
 */
function markMilestone(routePoints) {

	for ( i = 1; i < routePoints.length; i++) {
		var tableviewrow = Ti.UI.createTableViewRow({
			title : "Milestone " + i + ": " + routePoints[i].name,
			color : 'black',
			//height:'2%'
		});
		milestoneArray.push(tableviewrow);
	}
}

/**
 * Function to modify routes
 */
function modifyRoute() {
	$.MyRoute.close();
}

/**
 * INITIALIZATION LOGIC
 */
mapview.addAnnotations(annotations);
mapview.region = zoomToRegion(params.places);
getLocation();
$.table.data = milestoneArray;
$.mapView.add(mapview);
