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
    $.__views.topbar = Alloy.createController("common/navbar", {
        id: "topbar",
        __parentSymbol: $.__views.index
    });
    $.__views.topbar.setParent($.__views.index);
    $.__views.textField = Ti.UI.createTextField({
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        top: "10%",
        left: "10%",
        width: "80%",
        height: "10%",
        hintText: " Your Current State",
        borderRadius: 15,
        borderWidth: 2,
        backgroundColor: "lightgray",
        color: "black",
        id: "textField"
    });
    $.__views.index.add($.__views.textField);
    $.__views.view = Ti.UI.createView({
        top: "25%",
        left: "10%",
        width: "80%",
        height: "10%",
        backgroundColor: "lightgray",
        borderRadius: 15,
        borderWidth: 2,
        id: "view"
    });
    $.__views.index.add($.__views.view);
    $.__views.picker = Ti.UI.createPicker({
        top: "0%",
        left: "0%",
        width: "100%",
        height: "100%",
        borderRadius: 15,
        borderWidth: 2,
        id: "picker"
    });
    $.__views.view.add($.__views.picker);
    $.__views.table = Ti.UI.createTableView({
        top: "45%",
        left: "10%",
        width: "80%",
        height: "30%",
        backgroundColor: "lightgray",
        id: "table"
    });
    $.__views.index.add($.__views.table);
    $.__views.addtomilestone = Ti.UI.createButton({
        top: "80%",
        left: "10%",
        width: "80%",
        height: "10%",
        backgroundColor: "lightgray",
        color: "black",
        title: "Add To Milestone",
        id: "addtomilestone"
    });
    $.__views.index.add($.__views.addtomilestone);
    $.__views.dailogtextfield = Ti.UI.createTextField({
        hintText: "Enter Text",
        id: "dailogtextfield"
    });
    var __alloyId1 = [];
    __alloyId1.push("Ok");
    __alloyId1.push("Cancel");
    $.__views.dialog = Ti.UI.createAlertDialog({
        title: "Enter Route Name",
        bubbleParent: "false",
        androidView: $.__views.dailogtextfield,
        buttonNames: __alloyId1,
        id: "dialog",
        cancel: "1"
    });
    exports.destroy = function() {};
    _.extend($, $.__views);
    var data = require("data");
    var placestoshow = [ "place1", "place2", "place3", "place4", "place5", "place6", "place7", "place8", "place8", "place9" ];
    var place = {
        state: "",
        cities: []
    };
    place.state = "Andaman & Nicobar Islands";
    place.cities = _.pluck(data.places, "TOWN");
    var fillCities = function() {
        var cities = [];
        for (var i = 0; i < place.cities.length; i++) {
            var pickerRow = Ti.UI.createPickerRow({
                title: place.cities[i]
            });
            cities.push(pickerRow);
        }
        $.picker.add(cities);
    };
    fillCities();
    var tabledata = [];
    for (i = 0; i < placestoshow.length; i++) {
        var tableviewrow = Ti.UI.createTableViewRow({
            title: placestoshow[i],
            color: "black"
        });
        tabledata.push(tableviewrow);
    }
    $.table.data = tabledata;
    $.addtomilestone.addEventListener("click", function() {
        $.dialog.show();
    });
    $.dialog.addEventListener("click", function(e) {
        if (1 == e.index) $.dailogtextfield.value = ""; else {
            $.dailogtextfield.value = "";
            Alloy.createController("/MyRoute").getView().open();
            $.dialog.hide();
        }
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;