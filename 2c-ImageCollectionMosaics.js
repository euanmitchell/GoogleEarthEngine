// Image Collections - Mosaics
// Mosaics automatically take the pixels at the top of the stack
var geometry = ee.Geometry.Point([-106.623, 35.083]);
var s2 = ee.ImageCollection("COPERNICUS/S2");

var rgbVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'],
};
// Year 2019
var filtered = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .filter(ee.Filter.date('2019-01-01', '2020-01-01'))
  .filter(ee.Filter.bounds(geometry));
var mosaic = filtered.mosaic();
var medianComposite = filtered.median();

// Year 2020
var filtered20 = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .filter(ee.Filter.date('2020-01-01', '2021-01-01'))
  .filter(ee.Filter.bounds(geometry));
var mosaic20 = filtered20.mosaic();
var medianComposite20 = filtered20.median();

Map.addLayer(filtered, rgbVis, 'Filtered Collection 2019');
Map.addLayer(filtered20, rgbVis, 'Filtered Collection 2020');
Map.addLayer(mosaic, rgbVis, 'Mosaic 2019');
Map.addLayer(mosaic20, rgbVis, 'Mosaic 2020');
Map.addLayer(medianComposite, rgbVis, 'Median Composite 2019');
Map.addLayer(medianComposite20, rgbVis, 'Median Composite 2020');
