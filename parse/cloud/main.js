
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("placesSearch", function(request, response) {
  var query = new Parse.Query("Place");

  // Ensure that each token in the query string is contained within
  // the keywords field
  var tokens = request.params.query.split(' ');
  console.log(tokens);
  for (var i = 0; i < tokens.length; ++i) {
    // TODO: Change 'name' to 'keywords' once keywords are populated
    // TODO Fix problem, only last token gets added as a constraint
    query.contains("name", tokens[i]);
  }

  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function(error) {
      response.error(error);
    }
  });
});