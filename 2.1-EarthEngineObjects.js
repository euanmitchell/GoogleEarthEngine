// Module 2
// Earth Engine Objects

// Define a list of numbers
var myList = ee.List.sequence(1,10);

// Define a function to add 1 to a number
var myFunction = function(number) {
  return number+1;
}
print(myFunction(1));

// Re-define function using the GEE API
var myFunction = function(number) {
  return ee.Number(number).add(1);
}

// Map the function to the list
var newList = myList.map(myFunction);
print(newList);

// Extracting values from a list - indexing from zero
var third = newList.get(2);
print(third);

// Extracted values must be cast to GEE data type before manipulating
var value = ee.Number(third);
var newValue = value.add(2);
print(newValue);

// Dates can be handled with the ee.Date module
var date = ee.Date('2019-01-01');
var advanceDay = date.advance(16, 'day');
var advanceWeek = date.advance(1, 'week');
var advanceMonth = date.advance(2, 'month');
var advanceYear = date.advance(1, 'year');
print(advanceDay);
print(advanceWeek);
print(advanceMonth);
print(advanceYear);

// Current date and time need client-side JS and casting
var now = Date.now();   // milliseconds since Jan-01 1970 
print(now);
var eeNow = ee.Date(now);
print(now);
print(now/(1000*60*60*24*365))
