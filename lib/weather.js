(function() {
  var getWeather, getWeatherInternal, getWhereOnEarthID, http, query_to_woeid;
  http = require("http");
  query_to_woeid = {};
  getWhereOnEarthID = function(wanted, callback) {
    var opts, query, request;
    query = encodeURI("select woeid from geo.places where text=\"" + wanted + "\" limit 1&format=json");
    opts = {
      host: "query.yahooapis.com",
      path: "/v1/public/yql?q=" + query
    };
    request = http.request(opts, function(response) {
      var data;
      data = "";
      response.setEncoding("utf8");
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var body, woeid, _ref, _ref2, _ref3;
        body = JSON.parse(data);
        woeid = (_ref = body.query) != null ? (_ref2 = _ref.results) != null ? (_ref3 = _ref2.place) != null ? _ref3.woeid : void 0 : void 0 : void 0;
        if (!woeid) {
          return callback("Could not find where on earth ID");
        } else {
          return callback(null, woeid);
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
  getWeatherInternal = function(woeid, callback) {
    var opts, request;
    opts = {
      host: "weather.yahooapis.com",
      path: "/forecastjson?w=" + woeid + "&u=c"
    };
    request = http.request(opts, function(response) {
      var data;
      data = "";
      response.setEncoding("utf8");
      response.on("data", function(chunk) {
        return data += chunk;
      });
      response.on("end", function() {
        var body, weather;
        body = JSON.parse(data);
        if (!body.condition) {
          return;
        }
        weather = {
          current: "" + body.condition.text + ": " + body.condition.temperature,
          today: ("" + body.forecast[0].condition + ": ") + ("high - " + body.forecast[0].high_temperature + ", ") + ("low - " + body.forecast[0].low_temperature),
          tomorrow: ("" + body.forecast[1].condition + ": ") + ("high - " + body.forecast[1].high_temperature + ", ") + ("low - " + body.forecast[1].low_temperature)
        };
        return callback(null, weather);
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
