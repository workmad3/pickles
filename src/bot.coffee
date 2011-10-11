irc     = require "irc"
sys     = require "sys"

bash    = require "./bash"
fortune = require "./fortune"
github  = require "./github"
image   = require "./image"
imdb    = require "./imdb"
isup    = require "./isitup"
seen    = require "./seen"
time    = require "./time"
weather = require "./weather"

irc_server   = process.env.IRC_SERVER
irc_name     = process.env.IRC_NAME
irc_channels = process.env.IRC_CHANNELS.split ";"

handlers     = []
descriptions = []
client       = null

dispatch = (message) ->
  for pair in handlers
    [ pattern, handler ] = pair
    if message.from isnt irc_name and match = message.message.match pattern
      message.match = match
      handler message

hear = (pattern, callback) ->
  handlers.push [ pattern, callback ]

desc = (phrase, functionality) ->
  descriptions[phrase] = functionality

say = (channel, message) ->
  client.say channel, message

success = (message) ->
  console.log "\033[01;32m#{message}\033[0m"

error = (message) ->
  console.log "\033[01;31m#{message}\033[0m"

listen = ->
  opts = autoRejoin: true, channels: irc_channels, realName: irc_name, userName: irc_name

  client = new irc.Client irc_server, irc_name, opts

  client.addListener "message", (from, to, message) ->
    dispatch from: from, to: to, message: message
    success "#{to}:#{from} => #{message}"

  client.addListener "error", (message) ->
    error message

hear /^pickles: help/i, (message) ->
  say message.from, "I listen for the following..."
  for phrase, functionality of descriptions
    say message.from, "#{phrase} => #{functionality}"

desc 'weather me :place', 'Get the weather for now, today and tomorrow for :place'
hear /^weather me (.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  location = message.match[1]
  weather.getWeather location, (err, weather) ->
    if err or not weather
      say message.to, "Could not find weather for '#{location}'"
    else
      say message.to, "Current: #{weather.current}"
      say message.to, "Today: #{weather.today}"
      say message.to, "Tomorrow: #{weather.tomorrow}"

desc 'image me :phrase', 'Get a random image from Google Images for the search :phrase'
hear /^image me (.*)$/i, (message) ->
  seen.setSeenUser message.from, message.to
  phrase = message.match[1]
  image.getImage phrase, (err, image) ->
    if err or not image
      say message.to, "Could not find an image for '#{phrase}'"
    else
      say message.to, image

desc 'commit me :user/:project', 'Get the latest commit for the GitHub repo :user/:project'
hear /^commit me (.*)\/(.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  user = message.match[1]
  proj = message.match[2]
  github.getLatestCommit user, proj, (err, commit) ->
    if err or not commit
      say message.to, "Could not get latest commit for '#{user}/#{proj}'"
    else
      say message.to, "#{commit.author} commited '#{commit.message}' to #{user}/#{proj} on #{commit.date}"

desc 'fortune me', 'Get a poorly formatted fortune'
hear /fortune me/i, (message) ->
  seen.setSeenUser message.from, message.to
  fortune.getFortune (err, fortune) ->
    if err or not fortune
      say message.to, "#{message.from}: #{err}"
    else
      say message.to, "#{message.from}: #{fortune}"

desc 'bash me', 'Get a random quote link from bash.org'
hear /^bash me/i, (message) ->
  seen.setSeenUser message.from, message.to
  bash.getBash (err, bash) ->
    if err or not bash
      say message.to, "#{message.from}: #{err}"
    else
      say message.to, "#{message.from}: #{bash}"

desc 'seen :nick', 'Get when I last saw :nick and in which channel'
hear /^seen ([\w^_-|\{\}\[\]`\\]+)$/i, (message) ->
  seen.setSeenUser message.from, message.to
  user = message.match[1]
  seen.getSeenUser user, (err, msg) ->
    if err or not msg
      say message.to, "#{message.from}: #{err}"
    else
      say message.to, "#{message.from}: #{msg}"

desc 'roll me :side', 'Get a random number based on a die roll with :sides or 6 sides'
hear /^roll me ?(\d*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  sides = parseInt message.match[1] or 6
  if sides is 0
    say message.to, "#{message.from} I cannot make the warp core stabilizers divide by 0!"
  else
    say message.to, "#{message.from} rolls a #{sides} sided die and gets #{Math.floor(Math.random() * sides) + 1}"

desc 'is :domain up', 'Get the status of the website hosted at :domain'
hear /^is (.*) up/, (message) ->
  seen.setSeenUser message.from, message.to
  url = message.match[1]
  isup.isItUp url, (err, msg) ->
    if err or not msg
      say message.to, "#{message.from}: #{err}"
    else
      say message.to, "#{message.from}: #{msg}"

desc 'what is the time in :place', 'Get the current time in :place'
hear /^what is the time in (.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  place = message.match[1]
  time.getTime place, (err, msg) ->
    if err or not msg
      say message.to, "#{message.from}: #{err}"
    else
      say message.to, "#{message.from}: #{msg}"

desc 'movie me :movie_or_tv_show', 'Get the IMDb link for :movie_or_tv_show'
hear /^movie me (.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  query = message.match[1]
  imdb.getMovie query, (err, msg) ->
    if err or not msg
      say message.to, "#{message.from}: #{err}"
    else
      say message.to, "#{message.from}: #{msg}"

hear /(it's|its|it was) (long|short|hard)/i, (message) ->
  seen.setSeenUser message.from, message.to
  say message.to, "That's what she said!"

desc 'what are the pulls on :user/:project', 'Get the latest pull requests for the GitHub repo :user/:project'
hear /^what are the pulls on (.*)\/(.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  user = message.match[1]
  proj = message.match[2]
  github.getPullRequests user, proj, (err, msg) ->
    if err or not msg
      say message.to, "#{message.from}: #{err}"
    else
      for pull in msg
        say message.to, "#{pull}"

hear /.*/, (message) ->
  seen.setSeenUser message.from, message.to

listen()
