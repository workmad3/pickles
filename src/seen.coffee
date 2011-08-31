require "./date"

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
    callback null, "I last saw #{user} speak in #{seen.channel} at #{seen.time.toRelativeTime()}"
