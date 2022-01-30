// Module 1 Assignment

// Load the VIIRS Stray Light Corrected Nighttime Day/Night Band Composites
// and the Natural Earth 10m Urban Areas dataset
var dataset = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG");
var urban = ee.FeatureCollection("users/euanmitchell12/ne_10m_urban_areas");

// Filter Natural Earth features to Abq. by feature ID using 'Inspector'
// Ditto for NYC but multiple polygons so select individually and merge
var abq = urban.filter(ee.Filter.eq('system:index', '00000000000000000bda'));
var nyc1 = urban.filter(ee.Filter.eq('system:index', '000000000000000012ce'));
var nyc2 = urban.filter(ee.Filter.eq('system:index', '000000000000000012cf'));
var nyc3 = urban.filter(ee.Filter.eq('system:index', '000000000000000012d1'));
var nyc4 = urban.filter(ee.Filter.eq('system:index', '000000000000000012d0'));
var nyc5 = urban.filter(ee.Filter.eq('system:index', '00000000000000000015'));
var nyc = nyc1.merge(nyc2).merge(nyc3).merge(nyc4).merge(nyc5);
var geometry = nyc.geometry();
var rgbVis = {
  min: 0.0,
  max: 3000,    // Determine this value using 'Inspector'?
  bands: ['B4','B3','B2'],
};

// Filter VIIRS data by date and select nighttime lights band
var filter15 = dataset.filter(ee.Filter.date('2015-05-01', '2015-05-31'));
var nighttime15 = filter15.select('avg_rad');
var filter20 = dataset.filter(ee.Filter.date('2020-05-01', '2020-05-31'));
var nighttime20 = filter20.select('avg_rad');
var nighttimevis = {min: 0.0, max: 60.0};

// Add various layers to map
Map.addLayer(urban,rgbVis,'Urban');
Map.addLayer(nighttime15, nighttimevis, 'May 2015 Night');
Map.addLayer(nighttime20, nighttimevis, 'May 2020 Night');

// Clip to chosen city
var nyc15 = nighttime15.mean().clip(geometry);
var nyc20 = nighttime20.mean().clip(geometry);

// Add clipped city to map
Map.addLayer(nyc15, nighttimevis, 'New York City May 2015 Night');
Map.addLayer(nyc20, nighttimevis, 'New York City May 2020 Night');

// Make visualised image variables and export to Drive
var nyc15vis = nyc15.visualize(nighttimevis);
var nyc20vis = nyc20.visualize(nighttimevis);

Export.image.toDrive({
  image: nyc15vis,
  description: 'NYC_Night_May-2015',
  folder: 'earthEngine',
  fileNamePrefix: 'nyc15_vis',
  region: geometry,
  scale: 20,
  maxPixels: 1e9
});

Export.image.toDrive({
  image: nyc20vis,
  description: 'NYC_Night_May-2020',
  folder: 'earthEngine',
  fileNamePrefix: 'nyc20_vis',
  region: geometry,
  scale: 20,
  maxPixels: 1e9
});
