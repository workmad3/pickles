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
    user = user.toLowerCase();
    seen = seen_list[user];
    if (!seen) {
      return callback("not seen " + user + " yet, sorry");
    } else {
      return callback(null, "I last saw " + user + " speak in " + seen.channel + " at " + seen.time);
    }
  };
}).call(this);
