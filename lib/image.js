(function() {
  var getImage, http, url;
  http = require('http');
  url = require('url');
  getImage = function(phrase, callback) {
    var client, headers, host, path, req;
    host = 'ajax.googleapis.com';
    path = "/ajax/services/search/images?v=1.0&rsz=8&safe=active&q=" + phrase;
    client = http.createClient(80, host);
    headers = {
      'Host': 'ajax.googleapis.com'
    };
    req = client.request('GET', path, headers);
    req.on('response', function(resp) {
      var data;
      if (resp.statusCode === 200) {
        data = '';
        resp.setEncoding('utf8');
        resp.on('data', function(chunk) {
          return data += chunk;
        });
        resp.on('end', function() {
          var body, image, images;
          body = JSON.parse(data);
          images = body.responseData.results;
          image = images[Math.floor(Math.random() * images.length)];
          if (!image) {
            return callback('Could not find results for phrase');
          } else {
            return callback(null, image.unescapedUrl);
          }
        });
        return resp.on('error', function(err) {
          return callback(err);
        });
      }
    });
    req.on('error', function(err) {
      return callback(err);
    });
    return req.end();
  };
  exports.getImage = getImage;
}).call(this);
