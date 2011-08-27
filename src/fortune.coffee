http = require "http"

exports.getFortune = getFortune = (callback) ->
  opts =
    host: "www.fortunefortoday.com"
    path: "/getfortuneonly.php"

  request = http.request opts, (response) ->
    data = ""

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      data = data.replace /(\r\n|\n|\r)/gm, ""
      data = data.replace /\s\s+/g, " "
      body = data

      if not body
        callback "Could not find fortune"
      else
        callback null, body

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()
