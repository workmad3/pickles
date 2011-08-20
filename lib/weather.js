(function() {
  var getWeather, getWeatherInternal, getWhereOnEarthID, http, query_to_woeid, url;
  http = require('http');
  url = require('url');
  query_to_woeid = {};
  getWhereOnEarthID = function(wanted, callback) {
    var opts, path, query, request;
    path = '/v1/public/yql?q=';
    query = encodeURI('select woeid from geo.places where text="' + wanted + '" limit 1&format=json');
    opts = {
      host: 'query.yahooapis.com',
      path: path + query,
      port: 80
    };
    request = http.request(opts, function(resp) {
      var json;
      json = '';
      resp.on('data', function(chunk) {
        return json += chunk;
      });
      resp.on('end', function() {
        var results, woeid, _ref, _ref2, _ref3;
        results = JSON.parse(json);
        woeid = (_ref = results.query) != null ? (_ref2 = _ref.results) != null ? (_ref3 = _ref2.place) != null ? _ref3.woeid : void 0 : void 0 : void 0;
        if (!woeid) {
          return callback('Unknown Where on Earth ID');
        } else {
          return callback(null, woeid);
        }
      });
      return resp.on('error', function(err) {
        return callback(err);
      });
    });
    request.on('error', function(err) {
      return callback(err);
    });
    return request.end();
  };
  getWeatherInternal = function(woeid, callback) {
    var opts, path, request;
    path = '/forecastjson?w=' + woeid;
    opts = {
      host: 'weather.yahooapis.com',
      path: path,
      port: 80
    };
    request = http.request(opts, function(resp) {
      var json;
      json = '';
      resp.on('data', function(chunk) {
        return json += chunk;
      });
      resp.on('end', function() {
        var cur, results, today, tomorrow;
        results = JSON.parse(json);
        cur = results.condition.text + ': ' + results.condition.temperature;
        today = results.forecast[0].condition + ': ' + 'high - ' + results.forecast[0].high_temperature + ', ' + 'low - ' + results.forecast[0].low_temperature;
        tomorrow = results.forecast[1].condition + ': ' + 'high - ' + results.forecast[1].high_temperature + ', ' + 'low - ' + results.forecast[1].low_temperature;
        return callback(null, [cur, today, tomorrow]);
      });
      return resp.on('error', function(err) {
        return callback(err);
      });
    });
    request.on('error', function(err) {
      return callback(err);
    });
    return request.end();
  };
  getWeather = function(location, callback) {
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
          return callback(err.message || err);
        } else {
          query_to_woeid[location] = woeid;
          return getWeatherInternal(woeid, function(err, weather) {
            if (err) {
              return callback(err.message || err);
            } else {
              return callback(null, weather);
            }
          });
        }
      });
    }
  };
  exports.getWeather = getWeather;
}).call(this);
