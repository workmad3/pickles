(function() {
  var API_URL, getMovie, http;
  http = require('http');
  API_URL = process.env.IMDB_URL;
  exports.getMovie = getMovie = function(query, callback) {
    var opts, request, term;
    term = encodeURI(query);
    opts = {
      host: API_URL,
      path: "/by/title/" + term
    };
    return request = http.request(opts, function(response) {
      var data;
      data = "";
      response.setEncoding("utf8");
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var body, imdb_url, title;
        if (response.statusCode !== 200) {
          return callback("Could not find results for " + query);
        } else {
          body = JSON.parse(data);
          if (body.length === 0) {
            return callback("Could not find results for " + query);
          } else {
            title = body[0].title;
            imdb_url = "http://www.imdb.com/title/" + body[0].imdb_id;
            return callback(null, "" + title + " - " + imdb_url);
          }
        }
      });
      return request.end();
    });
  };
}).call(this);
