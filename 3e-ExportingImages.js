// Clipping Images
// Avoid clipping images or do so at the end!

var s2 = ee.ImageCollection("COPERNICUS/S2");
var urban = ee.FeatureCollection("users/euanmitchell12/ne_10m_urban_areas");

// Find feature ID using 'Inspector'
var abq = urban.filter(ee.Filter.eq('system:index', '00000000000000000bda'));
var nyc = urban.filter(ee.Filter.eq('system:index', '000000000000000012ce'));

var geometry = abq.geometry()
var rgbVis = {
  min: 0.0,
  max: 3000,    // Determine this value using 'Inspector'?
  bands: ['B4','B3','B2'],
};

var abq = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .filter(ee.Filter.date('2019-01-01', '2020-01-01'))
  .filter(ee.Filter.bounds(geometry));
var image = abq.median();
var clipped = image.clip(geometry);

Map.addLayer(clipped, rgbVis, 'Clipped Image');

// Export the raw bands
var exportImage = clipped.select('B.*');

Export.image.toDrive({
  image: exportImage,
  description: 'Abq_Composite_Raw',
  folder: 'earthEngine',
  fileNamePrefix: 'abq_comp_raw',
  region: geometry,
  scale: 20,
  maxPixels: 1e9
});

// Export the visualised image
var visualised = clipped.visualize(rgbVis);

Export.image.toDrive({
  image: visualised,
  description: 'Abq_Composite_Visualised',
  folder: 'earthEngine',
  fileNamePrefix: 'abq_comp_vis',
  region: geometry,
  scale: 20,
  maxPixels: 1e9
});
