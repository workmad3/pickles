(function() {
  var getMovie, http;
  http = require('http');
  exports.getMovie = getMovie = function(query, callback) {
    var opts, request;
    opts = {
      host: process.env.IMDB_URL,
      path: "/by/title/" + (encodeURI(query))
    };
    request = http.request(opts, function(response) {
      var data;
      if (response.statusCode === 200) {
        data = "";
        response.setEncoding("utf8");
        response.on("data", function(chunk) {
          return data += chunk;
        });
        response.on("end", function() {
          var body, imdb_id, title;
          body = JSON.parse(data);
          if (body.length === 0) {
            return callback("Could not find results for " + query);
          } else {
            title = body[0].title;
            imdb_id = body[0].imdb_id;
            return callback(null, "" + title + " - http://www.imdb.com/title/" + imdb_id);
          }
        });
        return response.on("error", function(error) {
          return callback(error);
        });
      }
    });
    request.on("error", function(error) {
      return callback(error);
    });
    return request.end();
  };
}).call(this);
