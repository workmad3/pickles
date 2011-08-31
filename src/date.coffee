Date::toRelativeTime = (now_threshold) ->
  delta = new Date - @

  now_threshold = parseInt now_threshold, 10
  now_threshold = 0 if isNan now_threshold

  return "Just now" if delta <= now_threshold

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
