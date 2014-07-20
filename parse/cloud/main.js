require('cloud/app.js');
require('cloud/fuse.min.js');

/*
 * Provides Cloud Functions for Rice Maps.
 */
Parse.Cloud.define("placesSearch", function(request, response) {
  console.log("Search Query: " + request.params.query);

  // Define Parse cloud query that retrieves all Place objects and matches them to a search
  var query = new Parse.Query("Place");
  query.find({
    success: function(results) {
      // Perform Fuse.js fuzzy search on all Place objects
      var options = {
        keys: ['name', 'symbol']
      }
      searcher = new Fuse(results, options);
      matches = searcher.search(request.params.query)

      response.success(matches);
    },
    error: function(error) {
      response.error(error);
    }
  });

});