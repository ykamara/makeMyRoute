function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.mapView = Ti.UI.createView({
        id: "mapView",
        height: "50%",
        width: "100%"
    });
    $.__views.index.add($.__views.mapView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Map = require("ti.map");
    var mapview = Map.createView({
        mapType: Map.NORMAL_TYPE,
        animate: true,
        regionFit: true,
        userLocation: true
    });
    $.mapView.add(mapview);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;