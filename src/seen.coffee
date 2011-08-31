seen_list = {}

exports.setSeenUser = setSeenuser = (user, channel) ->
  seen_list[ user.toLowerCase() ] =
    channel: channel
    time: new Date()

exports.getSeenUser = getSeenUser = (user, callback) ->
  seen = seen_list[ user.toLowerCase() ]

  if not seen
    callback "not seen #{user} yet, sorry"
  else
    callback null, "I last saw #{user} speak in #{seen.channel} #{seen.time.toRelativeTime()}"

Date::toRelativeDate = (olderDate, newerDate) ->
  olderDate = new Date olderDate if typeof olderDate is "string"
  newerDate = new Date newerDate if typeof newerDate is "string"

  milliseconds = newerDate - olderDate
  conversions = [
    [ "years", 31518720000 ],
    [ "months", 2626560000 ],
    [ "days", 86400000 ],
    [ "hours", 3600000 ],
    [ "minutes", 60000 ],
    [ "seconds", 1000 ]
  ]

  i = 0
  
  while i < conversions.length
    result = Math.floor(milliseconds / conversions[i][1])
    return result + " " + conversions[i][0] + " ago"  if result >= 2
    i++
  "1 second ago"
