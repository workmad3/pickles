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

exports.getPullRequests = getPullRequests = (user, proj, callback) ->
  opts = host: "api.github.com", path: "/repos/#{user}/#{proj}/pulls"

  request = https.request opts, (response) ->
    data = ""

    response.on "data", (chunk) ->
      data += chunk

    response.on "end", ->
      body = JSON.parse data
      
      if response.statusCode is 200
        return callback null, [ "No pull requests on: #{user}/#{proj}" ]

        pulls = []

        data.reverse

        if data[0]
          pulls.push "#{data[0].title} => #{data[0].body} - #{data[0].url}"

        if data[1]
          pulls.push "#{data[1].title} => #{data[1].body} - #{data[1].url}"

        if data[2]
          pulls.push "#{data[2].title} => #{data[2].body} - #{data[2].url}"

        callback null, pulls
      else
        callback "Could not find pull requests for: #{user}/#{proj}"

    response.on "error", (error) ->
      callback error

  request.on "error", (error) ->
    callback error

  request.end()
