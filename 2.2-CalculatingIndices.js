// Module 2
// Calculating Indices

// Get median annual pixel values for Sentinel-2 imagery over a region
var s2 = ee.ImageCollection("COPERNICUS/S2");
var admin2 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");

var bangalore = admin2.filter(ee.Filter.eq('ADM2_NAME', 'Bangalore Urban'));
var geometry = bangalore.geometry();

var filtered = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .filter(ee.Filter.date('2019-01-01', '2020-01-01'))
  .filter(ee.Filter.bounds(geometry));

var image = filtered.median();

// Calculate NDVI
// Band 8 = NIR; Band 4 = Red
var ndvi = image.normalizedDifference(['B8', 'B4']).rename(['NDVI']);

// Calculate Modified Normalized Difference Water Index (MNDWI)
// Band 3 = Green; Band 11 = SWIR1
var mndwi = image.normalizedDifference(['B3', 'B11']).rename(['MNDWI']);

// Calculate Soil-Adjusted Vegetation Index (SAVI) using expression() function
// SAVI = 1.5 * ((NIR - Red)/(NIR + Red + 0.5))
// NOTE: SAVI formula requires pixel values to be converted to reflectances
// by multiplying by 'scale' (0.0001 for Sentinel-2)
var scale = ee.Number(0.0001);
var savi = image.expression(
  '1.5 * ((NIR - Red)/(NIR+Red+0.5))', {
    'NIR': image.select('B8').multiply(scale),
    'Red': image.select('B4').multiply(scale),
  }
).rename(['SAVI']);

// Set display parameters
var rgbVis = {min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2']};
var ndviVis = {min: 0, max: 1, palette: ['white', 'green']};
var ndwiVis = {min:0, max:0.5, palette: ['white', 'blue']};

Map.addLayer(image.clip(geometry), rgbVis, 'Image');
Map.addLayer(mndwi.clip(geometry), ndwiVis, 'MNDWI');
Map.addLayer(savi.clip(geometry), ndviVis, 'SAVI');
Map.addLayer(ndvi.clip(geometry), ndviVis, 'NDVI');
