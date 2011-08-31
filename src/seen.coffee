seen_list = {}

exports.setSeenUser = setSeenuser = (user, channel) ->
  seen_list[ user.toLowerCase() ] =
    channel: channel
    time: new Date()

exports.getSeenUser = getSeenUser = (user, callback) ->
  return callback null, "That's me!" if user.toLowerCase() is "pickles"

  seen = seen_list[ user.toLowerCase() ]

  if not seen
    callback "not seen #{user} yet, sorry"
  else
    callback null, "I last saw #{user} speak in #{seen.channel} #{relative seen.time, new Date}"

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
