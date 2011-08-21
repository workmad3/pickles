irc     = require 'irc'
sys     = require 'sys'
env     = process.env

weather = require './weather'
image   = require './image'

SERVER   = env.IRC_SERVER
NAME     = env.IRC_NAME
CHANNELS = env.IRC_CHANNELS.split ';'

client = new irc.Client SERVER, NAME, {
  autoRejoin: true
  channels: CHANNELS,
  debug: true,
  realName: NAME,
  userName: NAME,
}

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

  #
  # weather me
  #
  if wanted = msg.match /weather me (.*)/i
    location = wanted[1]
    weather.getWeather location, (err, weather) ->
      if err or not weather
        error "weather:error => #{err}"
        speak to, "Could not find weather for: #{location}"
      else
        speak to, "Current: #{weather[0]}"
        speak to, "Today: #{weather[1]}"
        speak to, "Tomorrow: #{weather[2]}"

  #
  # image me
  #
  if wanted = msg.match /image me (.*)/i
    phrase = wanted[1]
    image.getImage phrase, (err, img) ->
      if err or not img
        error "image:error => #{err}"
        speak to, "Could not find image for: #{phrase}"
      else
        speak to, img

handle 'error', (msg) ->
  error msg
