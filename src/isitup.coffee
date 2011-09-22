http = require "http"

exports.isItUp = isItUp = (url, callback) ->
  opts =
    host: "www.isup.me"
    path: "/#{url}"

  request = http.request opts, (response) ->
    data = ""

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = ""
      

      unknown = data.indexOf 'doesn\'t look like a site on the interwho.'
      down = data.indexOf 'looks down from here.'
      up = data.indexOf 'is up.'

      if unknown isnt -1
        body = "#{url} doesn't look like a site on the interwho."
      else if down isnt -1
        body = "#{url} looks down from here."
      else if up isnt -1
        body = "#{url} is up."
      else
        body = null

      if not body
        callback "Could not find the status for #{url}"
      else
        callback null, body

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()
