require('cloud/app.js');

/*
 * Provides Cloud Functions for Rice Maps.
 */
Parse.Cloud.define("placesSearch", function(request, response) {
  console.log("Search Query: " + request.params.query);

  // Ensure that each token in the query string is contained within
  // the keywords field
  var query = new Parse.Query("Place");
  var tokens = request.params.query.split(' ');
  var regex = new RegExp(tokens.join("[\\w*\\s*]*"), "i");
  query.matches("name", regex);

  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function(error) {
      response.error(error);
    }
  });
});