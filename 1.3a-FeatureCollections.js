// Image Collections
// Import Level 1 and Level 2 Global Administrative Unit Layers Data
var admin1 = ee.FeatureCollection("FAO/GAUL/2015/level1");
var admin2 = ee.FeatureCollection("FAO/GAUL/2015/level2");
// Create filter for each of three states
var nm = ee.Filter.eq('ADM1_NAME', 'New Mexico');
var va = ee.Filter.eq('ADM1_NAME', 'Virginia');
var oh = ee.Filter.eq('ADM1_NAME', 'Ohio');
// Combine individual state filters
var stateFilter = ee.Filter.or(nm,va,oh);
// Filter the second level (counties) data for each of the three states
var states = admin2.filter(stateFilter);

var style1 = {
  fillColor: 'b5ffb4',
  color: '00909F',
  width: 1.0,
};
var style2 = {
  fillColor: '03cffc',
  color: '0366fc',
  width: 1.0,
};
admin1 = admin1.style(style1);
states = states.style(style2);
Map.addLayer(admin1, {}, 'First Level Administrative Units');
Map.addLayer(states, {}, 'Second Level Administrative Units');
