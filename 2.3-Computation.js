// Module 2
// Computation on Multiple Images with map()

// Get a simple RGB composite for the area of interest first
var s2 = ee.ImageCollection("COPERNICUS/S2");
var admin1 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level1");

var karnataka = admin1.filter(ee.Filter.eq('ADM1_NAME', 'Karnataka'));
var geometry = karnataka.geometry();

var filtered = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .filter(ee.Filter.date('2019-01-01', '2020-01-01'))
  .filter(ee.Filter.bounds(geometry));

var composite = filtered.median().clip(geometry);
var rgbVis = {min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2']};
Map.addLayer(composite, rgbVis, 'Karnataka Composite');
Map.centerObject(geometry);

// Write a function that computes NDVI for an image and adds it as a band
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('ndvi');
  return image.addBands(ndvi);
}

// Map the function over the collection
var withNdvi = filtered.map(addNDVI);

// This next line takes the image collection (which has lots of images, each
// with lots of bands) and reduces it to a single image (still with lots of
// bands) where each band is the pixel-by-pixel median of that corresponding
// band in all the individual images?
var composite = withNdvi.median();

// Then in this line we further reduce that multi-band image to a single
// band, in this case the NDVI one that we added with addNDVI()?
var ndviComposite = composite.select('ndvi').clip(geometry);

// Can apparently achieve exactly the same result with these two lines ...
// Select only the NDVI bands from the image collections first
var ndviBands = withNdvi.select('ndvi');
// Then take the median (and clip)
var ndviBandsComp = ndviBands.median().clip(geometry);

var palette = [
  'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
  '74A901', '66A000', '529400', '3E8601', '207401', '056201',
  '004C00', '023B01', '012E01', '011D01', '011301'
];

// Set display parameters
var ndviVis = {min: 0, max: 0.5, palette: palette};
Map.addLayer(ndviComposite, ndviVis, 'NDVI');
Map.addLayer(ndviBandsComp, ndviVis, 'MedianNDVI');
