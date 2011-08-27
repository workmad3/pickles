(function() {
  var getImage, http;
  http = require("http");
  exports.getImage = getImage = function(phrase, callback) {
    var client, headers, host, path, request;
    host = "ajax.googleapis.com";
    path = "/ajax/services/search/images?v=1.0&rsz=8&q=" + (encodeURI(phrase));
    client = http.createClient(80, host);
    headers = {
      Host: "ajax.googleapis.com"
    };
    request = client.request("GET", path, headers);
    request.on("response", function(response) {
      var data;
      if (response.statusCode === 200) {
        data = "";
        response.setEncoding("utf8");
        response.on("data", function(chunk) {
          return data += chunk;
        });
        response.on("end", function() {
          var body, image, images;
          body = JSON.parse(data);
          images = body.responseData.results;
          image = images[Math.floor(Math.random() * images.length)];
          if (!image) {
            return callback("Could not find results for phrase");
          } else {
            return callback(null, image.unescapedUrl);
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
