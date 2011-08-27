http = require "http"

query_to_woeid = {}

getWhereOnEarthID = (wanted, callback) ->
  query = encodeURI "select woeid from geo.places where text=\"#{wanted}\" limit 1&format=json"

  opts =
    host: "query.yahooapis.com"
    path: "/v1/public/yql?q=#{query}"

  request = http.request opts, (response) ->
    data = ""

    response.setEncoding "utf8"

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = JSON.parse data
      woeid = body.query?.results?.place?.woeid

      if not woeid
        callback "Could not find where on earth ID"
      else
        callback null, woeid

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()

getWeatherInternal = (woeid, callback) ->
  opts =
    host: "weather.yahooapis.com"
    path: "/forecastjson?w=#{woeid}"

  request = http.request opts, (response) ->
    data = ""

    response.setEncoding "utf8"

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = JSON.parse data

      return if not body.condition

      weather =
        current: "#{body.condition.text}: #{body.condition.temperature}"
        today: "#{body.forecast[0].condition}: " +
          "high - #{body.forecast[0].high_temperature}, " +
          "low - #{body.forecast[0].low_temperature}"
        tomorrow: "#{body.forecast[1].condition}: " +
          "high - #{body.forecast[1].high_temperature}, " +
          "low - #{body.forecast[1].low_temperature}"

      callback null, weather

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()

exports.getWeather = getWeather = (location, callback) ->
  seen = query_to_woeid[location]

  if seen
    getWeatherInternal seen, (err, weather) ->
      if err
        callback err.message or err
      else
        callback null, weather
  else
    getWhereOnEarthID location, (err, woeid) ->
      if err
        callback err
      else
        query_to_woeid[location] = woeid
        getWeatherInternal woeid, (err, weather) ->
          if err
            callback err
          else
            callback null, weather
