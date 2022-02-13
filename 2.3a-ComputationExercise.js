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
print(composite);
var rgbVis = {min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2']};
Map.addLayer(composite, rgbVis, 'Karnataka Composite');
Map.centerObject(geometry);

// Write a new function that computes NDVI and NDWI for an image and adds both as bands
function addIndices(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('ndvi');
  var ndwi = image.normalizedDifference(['B3', 'B8']).rename('ndwi');
  return image.addBands(ndvi).addBands(ndwi);
}

// Map the function over the collection
var withIndices = filtered.map(addIndices);

// Calculate the median of each band
var composite = withIndices.median();
print(composite);

// Select only the ndwi band for display
var ndwiComposite = composite.select('ndwi').clip(geometry);
print(ndwiComposite);

// Set display parameters
var ndwiVis = {min: 0, max: 1.0, palette: ['white', 'blue']};
Map.addLayer(ndwiComposite, ndwiVis, 'NDWI');
