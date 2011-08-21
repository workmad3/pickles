http = require 'http'

getImage = (phrase, callback) ->
  host = 'ajax.googleapis.com'
  path = "/ajax/services/search/images?v=1.0&rsz=8&safe=active&q=#{phrase}"

  client = http.createClient 80, host

  headers =
    'Host': 'ajax.googleapis.com'

  req = client.request 'GET', path, headers

  req.on 'response', (resp) ->
    if resp.statusCode is 200
      data = ''
      resp.setEncoding 'utf8'

      resp.on 'data', (chunk) ->
        data += chunk

      resp.on 'end', ->
        body = JSON.parse data
        images = body.responseData.results
        image  = images[ Math.floor Math.random()*images.length ]

        if not image
          callback 'Could not find results for phrase'
        else
          callback null, image.unescapedUrl

      resp.on 'error', (err) ->
        callback err

  req.on 'error', (err) ->
    callback err

  req.end()

exports.getImage = getImage
