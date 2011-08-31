(function() {
  var getSeenUser, seen_list, setSeenuser;
  require("./date");
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
      return callback(null, "I last saw " + user + " speak in " + seen.channel + " at " + (seen.time.toRelativeTime()));
    }
  };
}).call(this);
