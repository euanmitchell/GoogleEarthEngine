// Importing Datasets
// ne_10m_populated_places.zip downloaded and unzipped
// "Assets - New - Table Upload - Shapefiles"
var places = ee.FeatureCollection("users/euanmitchell12/ne_10m_populated_places_simple");
var largePlaces = places.filter(ee.Filter.gt('pop_max', 2000000));

var style = {
  color: 'red',
  pointSize: 10,
  pointShape: 'triangle'
};
largePlaces = largePlaces.style(style);

Map.addLayer(places, {color: 'blue', pointSize: 3}, 'Populated Places');
Map.addLayer(largePlaces, {}, 'Urban Areas');
