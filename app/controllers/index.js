var data = [];
data[0]=Ti.UI.createPickerRow({title:'Select Your City',backgroundColor : 'gray'});
data[1]=Ti.UI.createPickerRow({title:'Bangalore',backgroundColor : 'gray'});
data[2]=Ti.UI.createPickerRow({title:'Mysoor',backgroundColor : 'gray'});
data[3]=Ti.UI.createPickerRow({title:'Mangalore',backgroundColor : 'gray'});

var places=[];
places[0]=Ti.UI.createTableViewRow({title:'Marthahalli',color:'black'});
places[1]=Ti.UI.createTableViewRow({title:'Itpl',color:'black'});
places[2]=Ti.UI.createTableViewRow({title:'Magistic',color:'black'});
places[3]=Ti.UI.createTableViewRow({title:'Silk bord',color:'black'});
$.table.data=places;
$.picker.add(data);
$.index.open();
