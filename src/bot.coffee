irc     = require 'irc'
sys     = require 'sys'
env     = process.env

weather = require './weather'
image   = require './image'
github  = require './github'
fortune = require './fortune'
seen    = require './seen'

SERVER   = env.IRC_SERVER
NAME     = env.IRC_NAME
CHANNELS = env.IRC_CHANNELS.split ';'

opts =
  autoRejoin: true
  channels: CHANNELS
  debug: true
  realName: NAME
  userName: NAME

client = new irc.Client SERVER, NAME, opts

handle = (type, func) ->
  client.addListener type, func

speak = (chan, msg) ->
  client.say chan, msg

info = (msg) ->
  console.log "\033[01;32m#{msg}\033[0m"

error = (msg) ->
  console.log "\033[01;31m#{msg}\033[0m"

handle 'message', (from, to, msg) ->
  info "#{from} => #{to}: #{msg}"

  if wanted = msg.match /weather me (.*)/i
    seen.setSeenUser from, to
    location = wanted[1]
    weather.getWeather location, (err, weather) ->
      if err or not weather
        error "weather:error => #{err}"
        speak to, "Could not find weather for: #{location}"
      else
        speak to, "Current: #{weather.current}"
        speak to, "Today: #{weather.today}"
        speak to, "Tomorrow: #{weather.tomorrow}"

  if wanted = msg.match /image me (.*)/i
    seen.setSeenUser from, to
    phrase = wanted[1]
    image.getImage phrase, (err, img) ->
      if err or not img
        error "image:error => #{err}"
        speak to, "Could not find image for: #{phrase}"
      else
        speak to, img

  if wanted = msg.match /commit me (.*) (.*)/i
    seen.setSeenuser from, to
    user = wanted[1]
    proj = wanted[2]
    github.getLatestCommit user, proj, (err, commit) ->
      if err or not commit
        error "github:error => #{err}"
        speak to, "Could not get latest commit for: #{user}/#{proj}"
      else
        speak to, "#{commit.author} commited '#{commit.message}' to #{user}/#{proj} on #{commit.date}"

  if msg.match /fortune me/i
    seen.setSeenUser from, to
    fortune.getFortune (err, data) ->
      if err or not data
        error "fortune:error => #{err}"
        speak to, "Could not get fortune"
      else
        speak to, data

  if wanted = msg.match /seen (\w+)$/i
    seen.setSeenUser from, to
    user = wanted[1]
    seen.getSeenUser user, (err, at) ->
      if err or not at
        speak to, "#{from}: #{err}"
      else
        speak to, "#{from}: #{at}"

  if msg.match /roll me/i
    seen.setSeenUser from, to
    speak to, "#{from} rolls a six sided die and gets #{Math.floor(Math.random() * 6) + 1}"

handle 'error', (msg) ->
  error msg
