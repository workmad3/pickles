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

Date::toRelativeTime = (now_threshold) ->
  delta = new Date - @

  now_threshold = parseInt now_threshold, 10
  now_threshold = 0 if isNaN now_threshold

  return "just now" if delta <= now_threshold

  units = null
  conversions =
    millisecond: 1
    second: 1000
    minute: 60
    hour: 60
    day: 24
    month: 30
    year: 12

  for key in conversions
    break if delta < conversions[key]
    units = key
    delta /= conversions[key]

  delta = Math.floor delta
  units += "s" if delta isnt 1
  [ delta, units, "ago" ].join " "

Date.fromString = (str) ->
  new Date Date.parse str
