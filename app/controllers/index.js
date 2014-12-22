var Map = require('ti.map');

var mapview = Map.createView({
    mapType: Map.NORMAL_TYPE,
   // region:{latitude:33.74511, longitude:-84.38993, latitudeDelta:0.5, longitudeDelta:0.5},
    animate:true,
    regionFit:true,
    userLocation:true
});

$.mapView.add(mapview);

$.index.open();
