irc     = require 'irc'
sys     = require 'sys'
env     = process.env

weather = require './weather'
image   = require './image'
github  = require './github'
fortune = require './fortune'
seen    = require './seen'

irc_server   = env.IRC_SERVER
irc_name     = env.IRC_NAME
irc_channels = env.IRC_CHANNELS.split ';'

descriptions = {}
handlers = []
client = null

dispatch = (message) ->
  for pair in handlers
    [ pattern, handler ] = pair
    if message.from isnt irc_name and match = message.message.match pattern
      message.match = match
      console.log message
      handler message

desc = (phrase, functionality) ->
  descriptions[ phrase ] = functionality

hear = (pattern, callback) ->
  handlers.push [ pattern, callback ]

say = (channel, message) ->
  client.say channel, message

listen = ->
  opts =
    autoRejoin: true
    channels: irc_channels
    debug: true
    realName: irc_name
    userName: irc_name

  client = new irc.Client irc_server, irc_name, opts
  client.addListener 'message', (from, to, message) ->
    msg = { from: from, to: to, message: message }
    dispatch msg
    success "#{from} => #{to}: #{message}"
  client.addListener 'error', (message) ->
    error message

success = (message) ->
  console.log "\033[01;32m#{message}\033[0m"

error = (message) ->
  console.log "\033[01;31m#{message}\033[0m"

try
  listen()
  success 'Connected to server'
catch err
  error "Error connecting to server: #{err}"

hear /weather me (.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  location = message.match[1]
  weather.getWeather location, (err, weather) ->
    if err or not weather
      err "weather:error => #{err}"
      say message.to, "Could not find weather for '#{location}'"
    else
      say message.to, "Current: #{weather.current}"
      say message.to, "Today: #{weather.today}"
      say message.to, "Tomorrow: #{weather.tomorrow}"

hear /image me (.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  phrase = message.match[1]
  image.getImage phrase, (err, image) ->
      if err or not image
        error "image:error => #{err}"
        say message.to, "Could not find an image for '#{phrase}'"
      else
        say message.to, image

hear /commit me (.*) (.*)/i, (message) ->
  seen.setSeenUser message.from, message.to
  user = message.match[1]
  proj = message.match[2]
  github.getLatestCommit user, proj, (err, commit) ->
    if err or not commit
      error "github:error => #{err}"
      say message.to, "Could not get latest commit for '#{user}/#{proj}'"
    else
      say message.to, "#{commit.author} commited '#{commit.message}' to #{user}/#{proj} on #{commit.date}"

hear /fortune me/i, (message) ->
  console.log 'fortune:ok => heard "fortune me"'

  seen.setSeenUser message.from, message.to
  fortune.getFortune (err, fortune) ->
    if err or not fortune
      error "fortune:error => #{err}"
      say message.to, "Could not get fortune"
    else
      say message.to, fortune

hear /seen (\w+)$/i, (message) ->
  console.log 'seen:ok => heard "seen"'

  seen.setSeenUser message.from, message.to
  user = message.match[1]
  seen.getSeenUser user, (err, msg) ->
    if err or not msg
      say message.to, "#{message.from}: #{err}"
    else
      say message.to, "#{message.from}: #{msg}"

hear /roll me/i, (message) ->
  console.log 'roll:ok => heard "roll me"'

#   if wanted = msg.match /roll me/i
#     seen.setSeenUser from, to
#     speak to, "#{from} rolls a six sided die and gets #{Math.floor(Math.random() * 6) + 1}"
