(function() {
  var getLatestCommit, getPullRequests, https;
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
  exports.getPullRequests = getPullRequests = function(user, proj, callback) {
    var opts, request;
    opts = {
      host: "api.github.com",
      path: "/repos/" + user + "/" + proj + "/pulls"
    };
    request = https.request(opts, function(response) {
      var data;
      data = "";
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var body, pulls;
        body = JSON.parse(data);
        if (!body[0]) {
          return callback("Could not find pull requests for: " + user + "/" + proj);
        } else {
          body.reverse;
          pulls = [];
          if (body[0]) {
            pulls.push("" + body[0].title + " => " + body[0].html_url);
          }
          if (body[1]) {
            pulls.push("" + body[1].title + " => " + body[1].html_url);
          }
          if (body[2]) {
            pulls.push("" + body[2].title + " => " + body[2].html_url);
          }
          return callback(null, pulls);
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
