(function() {
  var getFortune, http;
  http = require('http');
  getFortune = function(callback) {
    var opts, req;
    opts = {
      host: 'www.fortunefortoday.com',
      path: '/getfortuneonly.php'
    };
    req = http.request(opts, function(resp) {
      var data;
      data = '';
      resp.on('data', function(chunk) {
        return data += chunk;
      });
      resp.on('end', function() {
        var body;
        data = data.replace(/(\r\n|\n|\r)/gm, '');
        data = data.replace(/\s\s+/g, ' ');
        body = data;
        if (!body) {
          return callback('Could not find fortune');
        } else {
          return callback(null, body);
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
  exports.getFortune = getFortune;
}).call(this);
