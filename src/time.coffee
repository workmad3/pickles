http = require 'http'

API_KEY = process.env.TIME_API_KEY

exports.getTime = getTime = (place, callback) ->
  place = place.replace("?", "")
  location = encodeURI place

  opts = host: "www.worldweatheronline.com", path: "/feed/tz.ashx?q=#{location}&format=json&key=#{API_KEY}"

  request = http.request opts, (response) ->
    data = ""

    response.setEncoding "utf8"

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = JSON.parse data

      if body.data.error
        callback "Could not find time for '#{place}'"
      else
        place = body.data.request[0].query
        time = body.data.time_zone[0].localtime
        callback null, "The time in #{place} is #{time}"

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()
