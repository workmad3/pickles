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
        if (response.statusCode === 200) {
          if (data.length = 0) {
            return callback(null, ["No pull requests on: " + user + "/" + proj]);
          }
          pulls = [];
          data.reverse;
          if (data[0]) {
            pulls.push("" + data[0].title + " => " + data[0].body + " - " + data[0].url);
          }
          if (data[1]) {
            pulls.push("" + data[1].title + " => " + data[1].body + " - " + data[1].url);
          }
          if (data[2]) {
            pulls.push("" + data[2].title + " => " + data[2].body + " - " + data[2].url);
          }
          return callback(null, pulls);
        } else {
          return callback("Could not find pull requests for: " + user + "/" + proj);
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
