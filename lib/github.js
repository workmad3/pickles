(function() {
  var getLatestCommit, https;
  https = require("https");
  exports.getLatestCommit = getLatestCommit = function(user, proj, callback) {
    var opts, request;
    opts = {
      host: "api.github.com",
      path: "/repos/" + user + "/" + proj + "/commits?per_page=1"
    };
    request = https.request(opts, function(response) {
      var data;
      data = "";
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var body, commit;
        body = JSON.parse(data);
        if (!body[0]) {
          return callback("Could not find latest commit for: " + user + "/" + proj);
        } else {
          commit = {
            author: body[0].commit.author.name,
            date: new Date(body[0].commit.author.date),
            message: body[0].commit.message
          };
          return callback(null, commit);
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
