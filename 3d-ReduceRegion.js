// reduceRegion
// Can be used to select an area of an image to calculate stats for

var s2 = ee.ImageCollection("COPERNICUS/S2");
var urban = ee.FeatureCollection("users/euanmitchell12/ne_10m_urban_areas");
var abq = urban.filter(ee.Filter.eq('system:index', '00000000000000000bda'));

var s2 = s2
  .select('B4','B3','B2')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .filter(ee.Filter.date('2019-01-01', '2019-02-01'))
  .filterBounds(abq.geometry())
  .median();

var stats = s2.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: abq.geometry(),
  scale: 30,
  maxPixels: 1e10
});
var reducer = ee.Reducer.mean().combine({
  reducer2: ee.Reducer.stdDev(),
  sharedInputs: true
});
var multiStats = s2.reduceRegion({
  reducer: reducer,
  geometry: abq.geometry(),
  scale: 30,
  maxPixels: 1e10
});

print('Mean values:',stats);
print('Mean and standard deviations:',multiStats);
