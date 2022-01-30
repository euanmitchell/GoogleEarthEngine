// Module 2
// Earth Engine Objects

// Get Sentinel-2 image collection and geometry for a point location
var s2 = ee.ImageCollection("COPERNICUS/S2");
var geometry = ee.Geometry.Point([77.60412933051538, 12.952912912328241]);

// Create date variables for current time and one month previously
var now = Date.now();
var now = ee.Date(now);
var start = now.advance(-1, 'month');

// Filter S2 collection and print number of images before and after date filter
var filtered = s2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .filter(ee.Filter.bounds(geometry));
print(filtered.size());
var filtered = filtered.filter(ee.Filter.date(start, now));
print(filtered.size());
