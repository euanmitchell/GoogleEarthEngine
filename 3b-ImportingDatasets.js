// Importing Datasets
// ne_10m_populated_places.zip downloaded and unzipped
// "Assets - New - Table Upload - Shapefiles"
var places = ee.FeatureCollection("users/euanmitchell12/ne_10m_populated_places_simple");
var largePlaces = places.filter(ee.Filter.gt('pop_max', 2000000));
var urban = ee.FeatureCollection("users/euanmitchell12/ne_10m_urban_areas");
var largeUrban = urban.filter(ee.Filter.gt('area_sqkm', 400));

var placeStyle = {
  color: 'red',
  pointSize: 10,
  pointShape: 'triangle'
};
var urbanStyle = {
  color: 'blue'
};
largePlaces = largePlaces.style(placeStyle);
largeUrban = largeUrban.style(urbanStyle);

Map.addLayer(places, {color: 'green', pointSize: 3}, 'Populated Places');
Map.addLayer(largePlaces, placeStyle, 'Populous Cities');
Map.addLayer(urban, {color: 'grey'}, 'Urban Areas');
Map.addLayer(largeUrban, urbanStyle, 'Large Urban Areas');
