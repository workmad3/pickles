https = require "https"

exports.getLatestCommit = getLatestCommit = (user, proj, callback) ->
  opts =
    host: "api.github.com"
    path: "/repos/#{user}/#{proj}/commits?per_page=1"

  request = https.request opts, (response) ->
    data = ""

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = JSON.parse data

      if not body[0]
        callback "Could not find latest commit for: #{user}/#{proj}"
      else
        commit =
          author: body[0].commit.author.name
          date: new Date body[0].commit.author.date
          message: body[0].commit.message
        callback null, commit

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()
