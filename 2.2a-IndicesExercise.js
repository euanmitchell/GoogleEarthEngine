// Module 2
// Calculating Indices

// Calculate Normalized Difference Built-Up Index for Sentinel-2 imagery over a region
// Visualise with a red palette
var s2 = ee.ImageCollection("COPERNICUS/S2");
var admin2 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");

var bangalore = admin2.filter(ee.Filter.eq('ADM2_NAME', 'Bangalore Urban'));
var geometry = bangalore.geometry();
Map.centerObject(geometry);

var filtered = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .filter(ee.Filter.date('2019-01-01', '2020-01-01'))
  .filter(ee.Filter.bounds(geometry));

var image = filtered.median();

// Calculate NDBI
// NDBI = (SWIR1 - NIR)/(SWIR1 + NIR)
// Band 8A = NIR (20m); Band 11 = SWIR1
var ndbi = image.normalizedDifference(['B11', 'B8A']).rename(['NDBI']);

// Manual ndbi
var scale = ee.Number(0.0001);
var ndbiMan = image.expression(
  '(SWIR1 - NIR)/(SWIR1 + NIR)', {
    'NIR': image.select('B8A').multiply(scale),
    'SWIR1': image.select('B11').multiply(scale),
  }
).rename(['NDBI2']);

// Set display parameters
var rgbVis = {min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2']};
var ndbiVis = {min: 0, max: 1, palette: ['white', 'red']};

Map.addLayer(image.clip(geometry), rgbVis, 'Image');
Map.addLayer(ndbi.clip(geometry), ndbiVis, 'NDBI');
Map.addLayer(ndbiMan.clip(geometry), ndbiVis, 'NDBI2');
