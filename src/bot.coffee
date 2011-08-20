env    = process.env
ranger = require 'ranger'

CAMPFIRE_ACCOUNT = env.CAMPFIRE_ACCOUNT
CAMPFIRE_ROOMID  = env.CAMPFIRE_ROOMID
CAMPFIRE_APIKEY  = env.CAMPFIRE_APIKEY

client = ranger.createClient CAMPFIRE_ACCOUNT, CAMPFIRE_APIKEY

client.room CAMPFIRE_ROOM, (room) ->
  console.log 'Joining ' + room.name
  room.join ->
    room.listen (msg) ->
      console.log msg

      if msg.type is 'TextMessage'
        if msg.body.match /^!s(shutdown)?/
          console.log 'Leaving ' + room.name
          room.leave ->
            process.exit 0
