http = require 'http'

query_to_woeid = {}

getWhereOnEarthID = (wanted, callback) ->
  query = encodeURI "select woeid from geo.places where text=\"#{wanted}\" limit 1&format=json"

  opts =
    host: 'query.yahooapis.com'
    path: "/v1/public/yql?q=#{query}"

  req = http.request opts, (resp) ->
    data = ''
    resp.setEncoding 'utf8'

    resp.on 'data', (chunk) ->
      data += chunk

    resp.on 'end', ->
      body = JSON.parse data
      woeid = body.query?.results?.place?.woeid

      if not woeid
        callback 'Could not find where on earth ID'
      else
        callback null, woeid

    resp.on 'error', (err) ->
      callback err

  req.on 'error', (err) ->
    callback err

  req.end()

getWeatherInternal = (woeid, callback) ->
  opts =
    host: 'weather.yahooapis.com'
    path: "/forecastjson?w=#{woeid}"

  req = http.request opts, (resp) ->
    data = ''
    resp.setEncoding 'utf8'

    resp.on 'data', (chunk) ->
      data += chunk

    resp.on 'end', ->
      body = JSON.parse data

      weather =
        current: "#{body.condition.text}: #{body.condition.temperature}"
        today: "#{body.forecast[0].condition}: " +
          "high - #{body.forecast[0].high_temperature}, " +
          "low - #{body.forecast[0].low_temperature}"
        tomorrow: "#{body.forecast[1].condition}: " +
          "high - #{body.forecast[1].high_temperature}, " +
          "low - #{body.forecast[1].low_temperature}"

      callback null, weather

    resp.on 'error', (err) ->
      callback err

  req.on 'error', (err) ->
    callback err

  req.end()

getWeather = (location, callback) ->
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

exports.getWeather = getWeather
