require('cloud/app.js');
var Fuse = require('cloud/fuse.min.js');


/*
 * Provides Cloud Functions for Rice Maps.
 */
Parse.Cloud.define("placeSearch", function(request, response) {
  console.log("Search Query: " + request.params.query);

  // Define Parse cloud query that retrieves all Place objects and matches them to a search
  var query = new Parse.Query("Place");
  query.limit(200);
  query.include("parentPlace");

  query.find({
    success: function(results) {
      // Perform Fuse.js fuzzy search on all Place objects
      var options = {
        keys: ['attributes.name', 'attributes.symbol']
      }

      var searcher = new Fuse(results, options);
      var matches = searcher.search(request.params.query);
      response.success(matches.slice(0, 10));
    },
    error: function(error) {
      response.error(error);
    }
  });
});


/*
 * Provides autocomplete suggestions for Places 
 */
Parse.Cloud.define("placeAutocomplete", function(request, response) {
  console.log("Search Query: " + request.params.query);

  // Define Parse cloud query that retrieves all Place objects and matches them to a search
  var query = new Parse.Query("Place");
  query.limit(200);
  query.include("parentPlace");
  query.select("name", "symbol");

  query.find({
    success: function(results) {
      // Perform Fuse.js fuzzy search on all Place objects
      var options = {
        keys: ['attributes.name', 'attributes.symbol']
      }

      var searcher = new Fuse(results, options);
      var matches = searcher.search(request.params.query);
      response.success(matches.slice(0, 5));
    },
    error: function(error) {
      response.error(error);
    }
  });
});


/*
 * Provides autocomplete suggestions for Sections 
 */
Parse.Cloud.define("courseAutocomplete", function(request, response) {
  console.log("Search Query: " + request.params.query);

  // Define Parse cloud query that retrieves all Place objects and matches them to a search
  var query = new Parse.Query("Course");
  query.limit(200); // Change for production

  query.find().then(function(results) {
      matches = []
      // TODO(john): Python code needs to go away
      // for result in results:
      //   if result.find(query) >= 0:
      //     return matches.append(result)
      // response.success(matches.slice(0, 5));
    },
    error: function(error) {
      response.error(error);
    }
  });
})

