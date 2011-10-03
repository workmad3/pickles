http = require 'http'

API_URL = process.env.IMDB_URL

exports.getMovie = getMovie = (query, callback) ->
  term = encodeURI query

  opts =
    host: API_URL
    path: "/by/title/#{term}"

  request = http.request opts, (response) ->
    data = ""

    response.setEncoding "utf8"

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      unless response.statusCode is 200
        callback "Could not find results for #{query}"
      else
        body = JSON.parse data

        if body.length is 0
          callback "Could not find results for #{query}"
        else
          title = body[0].title
          imdb_url = "http://www.imdb.com/title/#{body[0].imdb_id}"

          callback null, "#{title} - #{imdb_url}"

    request.end()
