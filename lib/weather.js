(function() {
  var getWeather, getWeatherInternal, getWhereOnEarthID, http, query_to_woeid;
  http = require('http');
  query_to_woeid = {};
  getWhereOnEarthID = function(wanted, callback) {
    var opts, query, req;
    query = encodeURI("select woeid from geo.places where text=\"" + wanted + "\" limit 1&format=json");
    opts = {
      host: 'query.yahooapis.com',
      path: "/v1/public/yql?q=" + query
    };
    req = http.request(opts, function(resp) {
      var data;
      data = '';
      resp.setEncoding('utf8');
      resp.on('data', function(chunk) {
        return data += chunk;
      });
      resp.on('end', function() {
        var body, woeid, _ref, _ref2, _ref3;
        body = JSON.parse(data);
        woeid = (_ref = body.query) != null ? (_ref2 = _ref.results) != null ? (_ref3 = _ref2.place) != null ? _ref3.woeid : void 0 : void 0 : void 0;
        if (!woeid) {
          return callback('Could not find where on earth ID');
        } else {
          return callback(null, woeid);
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
  getWeatherInternal = function(woeid, callback) {
    var opts, req;
    opts = {
      host: 'weather.yahooapis.com',
      path: "/forecastjson?w=" + woeid
    };
    req = http.request(opts, function(resp) {
      var data;
      data = '';
      resp.setEncoding('utf8');
      resp.on('data', function(chunk) {
        return data += chunk;
      });
      resp.on('end', function() {
        var body, weather;
        body = JSON.parse(data);
        weather = {
          current: "" + body.condition.text + ": " + body.condition.temperature,
          today: ("" + body.forecast[0].condition + ": ") + ("high - " + body.forecast[0].high_temperature + ", ") + ("low - " + body.forecast[0].low_temperature),
          tomorrow: ("" + body.forecast[1].condition + ": ") + ("high - " + body.forecast[1].high_temperature + ", ") + ("low - " + body.forecast[1].low_temperature)
        };
        return callback(null, weather);
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
  exports.getWeather = getWeather = function(location, callback) {
    var seen;
    seen = query_to_woeid[location];
    if (seen) {
      return getWeatherInternal(seen, function(err, weather) {
        if (err) {
          return callback(err.message || err);
        } else {
          return callback(null, weather);
        }
      });
    } else {
      return getWhereOnEarthID(location, function(err, woeid) {
        if (err) {
          return callback(err);
        } else {
          query_to_woeid[location] = woeid;
          return getWeatherInternal(woeid, function(err, weather) {
            if (err) {
              return callback(err);
            } else {
              return callback(null, weather);
            }
          });
        }
      });
    }
  };
}).call(this);
