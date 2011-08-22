http = require 'http'

getFortune = (callback) ->
  opts =
    host: 'www.fortunefortoday.com'
    path: '/getfortuneonly.php'

  req = http.request opts, (resp) ->
    data = ''

    resp.on 'data', (chunk) ->
      data += chunk

    resp.on 'end', ->
      data = data.replace /(\r\n|\n|\r)/gm, ''
      data = data.replace /\s\s+/g, ' '
      body = data

      if not body
        callback 'Could not find fortune'
      else
        callback null, body

    resp.on 'error', (err) ->
      callback err

  req.on 'error', (err) ->
    callback err

  req.end()

exports.getFortune = getFortune
