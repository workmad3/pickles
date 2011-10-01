(function() {
  var API_KEY, getTime, http;
  http = require('http');
  API_KEY = process.env.TIME_API_KEY;
  exports.getTime = getTime = function(place, callback) {
    var location, opts, request;
    place = place.replace("?", "");
    location = encodeURI(place);
    opts = {
      host: "www.worldweatheronline.com",
      path: "/feed/tz.ashx?q=" + location + "&format=json&key=" + API_KEY
    };
    request = http.request(opts, function(response) {
      var data;
      data = "";
      response.setEncoding("utf8");
      response.on("data", function(chunk) {
        return data += chunk;
      });
      return response.on("end", function() {
        var body, time;
        body = JSON.parse(data);
        if (body.data.error) {
          return callback("Could not find time for '" + place + "'");
        } else {
          place = body.data.request[0].query;
          time = body.data.time_zone[0].localtime;
          return callback(null, "The time in " + place + " is " + time);
        }
      });
    });
    return request.end();
  };
}).call(this);
