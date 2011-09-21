redis = require "redis"

host = process.env.REDISTOGO_HOST
port = process.env.REDISTOGO_PORT
pass = process.env.REDISTOGO_PASS

connect_redis = ->
  client = redis.createClient port, host
  client.on "error", (err) ->
    console.log err
  client.auth pass
  client

exports.setSeenUser = setSeenuser = (user, channel) ->
  client = connect_redis()
  client.hset "user:#{user.toLowerCase()}", "channel", channel
  client.hset "user:#{user.toLowerCase()}", "time", new Date
  client.quit()

exports.getSeenUser = getSeenUser = (user, callback) ->
  return callback null, "That's me!" if user.toLowerCase() is "pickles"

  client = connect_redis()

  client.hgetall "user:#{user.toLowerCase()}", (err, reply) ->
    if not reply.channel and not reply.time
      callback "not seen #{user} yet, sorry"
    else
      callback null, "I last saw #{user} speak in #{reply.channel} #{relative reply.time, new Date}"

  client.quit()

relative = (olderDate, newerDate) ->
  olderDate = new Date olderDate if typeof olderDate is "string"
  newerDate = new Date newerDate if typeof newerDate is "string"

  milliseconds = newerDate - olderDate
  conversions = [
    [ "year(s)", 31518720000 ],
    [ "month(s)", 2626560000 ],
    [ "day(s)", 86400000 ],
    [ "hour(s)", 3600000 ],
    [ "minute(s)", 60000 ],
    [ "second(s)", 1000 ]
  ]

  i = 0
  
  while i < conversions.length
    result = Math.floor(milliseconds / conversions[i][1])
    return result + " " + conversions[i][0] + " ago"  if result >= 1
    i++
  "just now"
