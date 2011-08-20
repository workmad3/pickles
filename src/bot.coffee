# **Pickles** is a some-what intelligent IRC bot. Pickles was originally going
# to be for Campfire, however Pickles lost his sleeping bag.

irc = require 'irc'
sys = require 'sys'
env = process.env

# Read in configuration options from environment variables.
# * `IRC_SERVER`   - the address of the IRC server to connect to
# * `IRC_NAME`     - the name you wish to give pickles
# * `IRC_CHANNELS` - semi colon delimited list of channels (e.g. `#foo;#bar;#baz`)
SERVER   = env.IRC_SERVER
NAME     = env.IRC_NAME
CHANNELS = env.IRC_CHANNELS.split ';'

# Create a new `Client` instance and connect to the specific IRC network.
# Pickles will join to each of the channels specified.
client = new irc.Client SERVER, NAME, {
  autoRejoin: true
  channels: CHANNELS,
  debug: true,
  realName: NAME,
  userName: NAME,
}

# Add a listener for the `raw` message type, this can be used for debugging.
client.addListener 'raw', (msg) ->
  console.log msg

# Add a listener for the `message` message type, these are incoming messages.
client.addListener 'message', (from, to, msg) ->
  console.log "\033[01;32m" + from + ' => ' + to + ': ' + msg + "\033[0m"

# Add a listener for the `error` message type, these are for when shits gone bad.
client.addListener 'error', (msg) ->
  console.log "\033[01;31m" + msg + "\033[0m"
