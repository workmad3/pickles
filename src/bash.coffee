http = require "http"

exports.getBash = getBash = (callback) ->
  opts = host: "bash.org", path: "/?random"

  request = http.request opts, (response) ->
    data = ""

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      data = data.replace(/[\s\S]*?<p class="qt">/m, '').replace(/<\/p>[\s\S]*$/m, '')
      data = data.replace(/&lt;/mg, "<").replace(/&gt;/mg, ">").replace(/&quot;/mg, "'")
      data = data.replace(/<br \/>/mg, "")
      data = data.replace(/\n/g, "; ")
      data = data.replace(/\s/g, ' ')
      quote = data

      if not quote
        callback "Could not find bash quote"
      else
        callback null, quote

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()
