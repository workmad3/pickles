(function() {
  var getFortune, http;
  http = require("http");
  exports.getFortune = getFortune = function(callback) {
    var opts, request;
    opts = {
      host: "www.fortunefortoday.com",
      path: "/getfortuneonly.php"
    };
    request = http.request(opts, function(response) {
      var data;
      data = "";
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var body;
        data = data.replace(/(\r\n|\n|\r)/gm, "");
        data = data.replace(/\s\s+/g, " ");
        body = data;
        if (!body) {
          return callback("Could not find fortune");
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
