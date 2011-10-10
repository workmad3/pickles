https = require "https"

exports.getLatestCommit = getLatestCommit = (user, proj, callback) ->
  opts = host: "api.github.com", path: "/repos/#{user}/#{proj}/commits?per_page=1"

  request = https.request opts, (response) ->
    data = ""

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = JSON.parse data

      unless body[0]
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

exports.getPullRequests = getPullRequests = (user, proj, callback) ->
  opts = host: "api.github.com", path: "/repos/#{user}/#{proj}/pulls"

  request = https.request opts, (response) ->
    data = ""

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = JSON.parse data

      unless body[0]
        callback "Could not find pull requests for: #{user}/#{proj}"
      else
        body.reverse

        pulls = []

        pulls.push "#{body[0].title} => #{body[0].html_url}" if body[0]
        pulls.push "#{body[1].title} => #{body[1].html_url}" if body[1]
        pulls.push "#{body[2].title} => #{body[2].html_url}" if body[2]

        callback null, pulls

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()
