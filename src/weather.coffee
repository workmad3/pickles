http = require 'http'
url  = require 'url'

query_to_woeid = {}

getWhereOnEarthID = (wanted, callback) ->
  path = '/v1/public/yql?q='
  query = encodeURI 'select woeid from geo.places where text="' + wanted + '" limit 1&format=json'
  opts = {
    host: 'query.yahooapis.com',
    path: path + query,
    port: 80,
  }

  request = http.request opts, (resp) ->
    json = ''

    resp.on 'data', (chunk) ->
      json += chunk

    resp.on 'end', ->
      results = JSON.parse json
      woeid = results.query?.results?.place?.woeid

      if not woeid
        callback 'Unknown Where on Earth ID'
      else
        callback null, woeid

    resp.on 'error', (err) ->
      callback err

  request.on 'error', (err) ->
    callback err

  request.end()

getWeatherInternal = (woeid, callback) ->
  path = '/forecastjson?w=' + woeid
  opts = {
    host: 'weather.yahooapis.com',
    path: path,
    port: 80,
  }

  request = http.request opts, (resp) ->
    json = ''
    resp.on 'data', (chunk) ->
      json += chunk

    resp.on 'end', ->
      results = JSON.parse json

      cur = results.condition.text + ': ' + results.condition.temperature

      today = results.forecast[0].condition + ': ' +
        'high - ' + results.forecast[0].high_temperature + ', ' +
        'low - ' + results.forecast[0].low_temperature

      tomorrow = results.forecast[1].condition + ': ' +
        'high - ' + results.forecast[1].high_temperature + ', ' +
        'low - ' + results.forecast[1].low_temperature

      callback null, [cur, today, tomorrow]

    resp.on 'error', (err) ->
      callback err

  request.on 'error', (err) ->
    callback err

  request.end()

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
        callback err.message or err
      else
        query_to_woeid[location] = woeid
        getWeatherInternal woeid, (err, weather) ->
          if err
            callback err.message or err
          else
            callback null, weather

exports.getWeather = getWeather
