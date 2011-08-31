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
    if (user.toLowerCase() === "pickles") {
      return callback(null, "That's me!");
    }
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
    conversions = [["year(s)", 31518720000], ["month(s)", 2626560000], ["day(s)", 86400000], ["hour(s)", 3600000], ["minute(s)", 60000], ["second(s)", 1000]];
    i = 0;
    while (i < conversions.length) {
      result = Math.floor(milliseconds / conversions[i][1]);
      if (result >= 1) {
        return result + " " + conversions[i][0] + " ago";
      }
      i++;
    }
    return "just now";
  };
}).call(this);
