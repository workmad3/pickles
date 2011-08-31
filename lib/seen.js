(function() {
  var getSeenUser, relative, seen_list, setSeenuser;
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
      return callback(null, "I last saw " + user + " speak in " + seen.channel + " " + (relative(seen.time, new Date)));
    }
  };
  relative = function(olderDate, newerDate) {
    var conversions, i, milliseconds, result;
    if (typeof olderDate === "string") {
      olderDate = new Date(olderDate);
    }
    if (typeof newerDate === "string") {
      newerDate = new Date(newerDate);
    }
    milliseconds = newerDate - olderDate;
    conversions = [["years", 31518720000], ["months", 2626560000], ["days", 86400000], ["hours", 3600000], ["minutes", 60000], ["seconds", 1000]];
    i = 0;
    while (i < conversions.length) {
      result = Math.floor(milliseconds / conversions[i][1]);
      if (result >= 2) {
        return result + " " + conversions[i][0] + " ago";
      }
      i++;
    }
    return "1 second ago";
  };
}).call(this);
