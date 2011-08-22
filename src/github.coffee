https = require 'https'

exports.getLatestCommit = getLatestCommit = (user, proj, callback) ->
  opts =
    host: 'api.github.com'
    path: "/repos/#{user}/#{proj}/commits?per_page=1"

  req = https.request opts, (resp) ->
    data = ''

    resp.on 'data', (chunk) ->
      data += chunk

    resp.on 'end', ->
      body = JSON.parse data

      if not body[0]
        callback "Could not find latest commit for: #{user}/#{proj}"
      else
        commit =
          author: body[0].commit.author.name
          date: new Date body[0].commit.author.date
          message: body[0].commit.message
        callback null, commit

    resp.on 'error', (err) ->
      callback err

  req.on 'error', (err) ->
    callback err

  req.end()
