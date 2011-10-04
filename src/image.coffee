http = require "http"

exports.getImage = getImage = (phrase, callback) ->
  host = "ajax.googleapis.com"
  path = "/ajax/services/search/images?v=1.0&safe=off&rsz=8&q=#{encodeURI phrase}"

  client = http.createClient 80, host

  headers =
    Host: "ajax.googleapis.com"

  request = client.request "GET", path, headers

  request.on "response", (response) ->
    if response.statusCode is 200
      data = ""

      response.setEncoding "utf8"

      response.on "data", (chunk) ->
        data += chunk

      response.on "end", ->
        body = JSON.parse data
        images = body.responseData.results
        image  = images[ Math.floor Math.random() * images.length ]

        if not image
          callback "Could not find results for phrase"
        else
          callback null, image.unescapedUrl

      response.on "error", (error) ->
        callback error

  request.on "error", (error) ->
    callback error

  request.end()
