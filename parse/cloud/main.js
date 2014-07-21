require('cloud/app.js');
var Fuse = require('cloud/fuse.min.js');

/*
 * Provides Cloud Functions for Rice Maps.
 */
Parse.Cloud.define("placesSearch", function(request, response) {
  console.log("Search Query: " + request.params.query);

  // Define Parse cloud query that retrieves all Place objects and matches them to a search
  var query = new Parse.Query("Place");
  query.find({
    success: function(results) {
      // Converts Parse objects to json so Fuse can use them
      var places = results.map(function(obj){
        return obj.toJSON();
      });
      // Perform Fuse.js fuzzy search on all Place objects
      var options = {
        keys: ['name', 'symbol']
      }

      var searcher = new Fuse(places, options);
      var matches = searcher.search(request.params.query);
      response.success(matches);
    },
    error: function(error) {
      response.error(error);
    }
  });

});