(function() {
  var connect_redis, getSeenUser, host, pass, port, redis, relative, setSeenuser;
  redis = require("redis");
  host = process.env.REDISTOGO_HOST;
  port = process.env.REDISTOGO_PORT;
  pass = process.env.REDISTOGO_PASS;
  connect_redis = function() {
    var client;
    client = redis.createClient(port, host);
    client.on("error", function(err) {
      return console.log(err);
    });
    client.auth(pass);
    return client;
  };
  exports.setSeenUser = setSeenuser = function(user, channel) {
    var client;
    client = connect_redis();
    client.hset("user:" + (user.toLowerCase()), "channel", channel);
    client.hset("user:" + (user.toLowerCase()), "time", new Date);
    return client.quit();
  };
  exports.getSeenUser = getSeenUser = function(user, callback) {
    var client;
    if (user.toLowerCase() === "pickles") {
      return callback(null, "That's me!");
    }
    client = connect_redis();
    client.hgetall("user:" + (user.toLowerCase()), function(err, reply) {
      if (!reply.channel && !reply.time) {
        return callback("not seen " + user + " yet, sorry");
      } else {
        return callback(null, "I last saw " + user + " speak in " + reply.channel + " " + (relative(reply.time, new Date)));
      }
    });
    return client.quit();
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
