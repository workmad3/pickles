(function() {
  var getBash, http, parser;
  http = require("http");
  parser = require("xml2json");
  exports.getBash = getBash = function(callback) {
    var opts, request;
    opts = {
      host: "bash.org",
      path: "/?random"
    };
    request = http.request(opts, function(response) {
      var data;
      data = "";
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var quote;
        data = data.replace(/[\s\S]*?<p class="qt">/m, '').replace(/<\/p>[\s\S]*$/m, '');
        data = data.replace(/&lt;/mg, "<").replace(/&gt;/mg, ">").replace(/&quot;/mg, "'");
        data = data.replace(/<br \/>/mg, "");
        quote = data;
        if (!quote) {
          return callback("Could not find bash quote");
        } else {
          return callback(null, quote);
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
