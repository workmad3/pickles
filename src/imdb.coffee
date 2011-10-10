http = require 'http'

exports.getMovie = getMovie = (query, callback) ->
  opts = host: process.env.IMDB_URL, path: "/by/title/#{encodeURI query}"

  request = http.request opts, (response) ->
    if response.statusCode is 200
      data = ""

      response.setEncoding "utf8"

      response.on "data", (chunk) ->
        data += chunk

      response.on "end", ->
        body = JSON.parse data
        
        if body.length is 0
          callback "Could not find results for #{query}"
        else
          title = body[0].title
          imdb_id = body[0].imdb_id
          callback null, "#{title} - http://www.imdb.com/title/#{imdb_id}"

      response.on "error", (error) ->
        callback error

  request.on "error", (error) ->
    callback error

  request.end()
