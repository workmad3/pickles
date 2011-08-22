(function() {
  var getLatestCommit, https;
  https = require('https');
  exports.getLatestCommit = getLatestCommit = function(user, proj, callback) {
    var opts, req;
    opts = {
      host: 'api.github.com',
      path: "/repos/" + user + "/" + proj + "/commits?per_page=1"
    };
    req = https.request(opts, function(resp) {
      var data;
      data = '';
      resp.on('data', function(chunk) {
        return data += chunk;
      });
      resp.on('end', function() {
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
      return resp.on('error', function(err) {
        return callback(err);
      });
    });
    req.on('error', function(err) {
      return callback(err);
    });
    return req.end();
  };
}).call(this);
