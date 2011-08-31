(function() {
  var getSeenUser, seen_list, setSeenuser;
  seen_list = {};
  exports.setSeenUser = setSeenuser = function(user, channel) {
    return seen_list[user.toLowerCase()] = {
      channel: channel,
      time: new Date()
    };
  };
  exports.getSeenUser = getSeenUser = function(user, callback) {
    var seen;
    seen = seen_list[user.toLowerCase()];
    if (!seen) {
      return callback("not seen " + user + " yet, sorry");
    } else {
      return callback(null, "I last saw " + user + " speak in " + seen.channel + " " + (seen.time.toRelativeTime()));
    }
  };
  Date.prototype.toRelativeTime = function(now_threshold) {
    var conversions, delta, key, units, _i, _len;
    delta = new Date - this;
    now_threshold = parseInt(now_threshold, 10);
    if (isNaN(now_threshold)) {
      now_threshold = 0;
    }
    if (delta <= now_threshold) {
      return "just now";
    }
    units = null;
    conversions = {
      millisecond: 1,
      second: 1000,
      minute: 60,
      hour: 60,
      day: 24,
      month: 30,
      year: 12
    };
    for (_i = 0, _len = conversions.length; _i < _len; _i++) {
      key = conversions[_i];
      if (delta < conversions[key]) {
        break;
      }
      units = key;
      delta /= conversions[key];
    }
    delta = Math.floor(delta);
    if (delta !== 1) {
      units += "s";
    }
    return [delta, units, "ago"].join(" ");
  };
  Date.fromString = function(str) {
    return new Date(Date.parse(str));
  };
}).call(this);
