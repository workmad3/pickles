irc     = require 'irc'
sys     = require 'sys'
env     = process.env

weather = require './weather'

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
  console.log "\033[01;32m" + msg + "\033[0m"

error = (msg) ->
  console.log "\033[01;31m" + msg + "\033[0m"

handle 'message', (from, to, msg) ->
  info from + ' => ' + to + ': ' + msg

  if wanted = msg.match /^!w(?:eather)?\s+(.*)/
    weather.getWeather wanted[1], (err, weather) ->
      if err or not weather
        error 'weather:error => ' + err or 'Could not find weather for: ' + wanted[1]
        speak to, 'Could not find weather for: ' + wanted[1]
      else
        speak to, 'Current: ' + weather[0]
        speak to, 'Today: ' + weather[1]
        speak to, 'Tomorrow: ' + weather[2]

handle 'error', (msg) ->
  error msg
