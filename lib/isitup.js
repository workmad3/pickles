(function() {
  var http, isItUp;
  http = require("http");
  exports.isItUp = isItUp = function(url, callback) {
    var opts, request;
    opts = {
      host: "www.isup.me",
      path: "/" + url
    };
    request = http.request(opts, function(response) {
      var data;
      data = "";
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var body, down, unknown, up;
        body = "";
        unknown = data.indexOf('doesn\'t look like a site on the interwho.');
        down = data.indexOf('looks down from here.');
        up = data.indexOf('is up.');
        if (unknown !== -1) {
          body = "" + url + " doesn't look like a site on the interwho.";
        } else if (down !== -1) {
          body = "" + url + " looks down from here.";
        } else if (up !== -1) {
          body = "" + url + " is up.";
        } else {
          body = null;
        }
        if (!body) {
          return callback("Could not find the status for " + url);
        } else {
          return callback(null, body);
        }
      });
      return response.on("error", function(error) {
        return callback(error);
      });
    });
    request.on("error", function(error) {
      return callback(error);
    });
    return request.end();
  };
}).call(this);
