(function() {
  var client, dispatch, error, fortune, github, handlers, hear, image, irc, irc_channels, irc_name, irc_server, isup, listen, say, seen, success, sys, weather;
  irc = require("irc");
  sys = require("sys");
  weather = require("./weather");
  image = require("./image");
  github = require("./github");
  fortune = require("./fortune");
  isup = require("./isitup");
  seen = require("./seen");
  irc_server = process.env.IRC_SERVER;
  irc_name = process.env.IRC_NAME;
  irc_channels = process.env.IRC_CHANNELS.split(";");
  handlers = [];
  client = null;
  dispatch = function(message) {
    var handler, match, pair, pattern, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      pair = handlers[_i];
      pattern = pair[0], handler = pair[1];
      _results.push(message.from !== irc_name && (match = message.message.match(pattern)) ? (message.match = match, handler(message)) : void 0);
    }
    return _results;
  };
  hear = function(pattern, callback) {
    return handlers.push([pattern, callback]);
  };
  say = function(channel, message) {
    return client.say(channel, message);
  };
  listen = function() {
    var opts;
    opts = {
      autoRejoin: true,
      channels: irc_channels,
      realName: irc_name,
      userName: irc_name
    };
    client = new irc.Client(irc_server, irc_name, opts);
    client.addListener("message", function(from, to, message) {
      dispatch({
        from: from,
        to: to,
        message: message
      });
      return success("" + to + ":" + from + " => " + message);
    });
    return client.addListener("error", function(message) {
      return error(message);
    });
  };
  success = function(message) {
    return console.log("\033[01;32m" + message + "\033[0m");
  };
  error = function(message) {
    return console.log("\033[01;31m" + message + "\033[0m");
  };
  hear(/^weather me (.*)/i, function(message) {
    var location;
    seen.setSeenUser(message.from, message.to);
    location = message.match[1];
    return weather.getWeather(location, function(err, weather) {
      if (err || !weather) {
        error("weather:error => " + err);
        return say(message.to, "Could not find weather for '" + location + "'");
      } else {
        say(message.to, "Current: " + weather.current);
        say(message.to, "Today: " + weather.today);
        return say(message.to, "Tomorrow: " + weather.tomorrow);
      }
    });
  });
  hear(/^image me (.*)$/i, function(message) {
    var phrase;
    seen.setSeenUser(message.from, message.to);
    phrase = message.match[1];
    return image.getImage(phrase, function(err, image) {
      if (err || !image) {
        error("image:error => " + err);
        return say(message.to, "Could not find an image for '" + phrase + "'");
      } else {
        return say(message.to, image);
      }
    });
  });
  hear(/^commit me (.*)\/(.*)/i, function(message) {
    var proj, user;
    seen.setSeenUser(message.from, message.to);
    user = message.match[1];
    proj = message.match[2];
    return github.getLatestCommit(user, proj, function(err, commit) {
      if (err || !commit) {
        error("github:error => " + err);
        return say(message.to, "Could not get latest commit for '" + user + "/" + proj + "'");
      } else {
        return say(message.to, "" + commit.author + " commited '" + commit.message + "' to " + user + "/" + proj + " on " + commit.date);
      }
    });
  });
  hear(/fortune me/i, function(message) {
    seen.setSeenUser(message.from, message.to);
    return fortune.getFortune(function(err, fortune) {
      if (err || !fortune) {
        error("fortune:error => " + err);
        return say(message.to, "Could not get fortune");
      } else {
        return say(message.to, fortune);
      }
    });
  });
  hear(/^seen (\w+)/i, function(message) {
    var user;
    seen.setSeenUser(message.from, message.to);
    user = message.match[1];
    return seen.getSeenUser(user, function(err, msg) {
      if (err || !msg) {
        return say(message.to, "" + message.from + ": " + err);
      } else {
        return say(message.to, "" + message.from + ": " + msg);
      }
    });
  });
  hear(/^roll me ?(\d*)/i, function(message) {
    var sides;
    seen.setSeenUser(message.from, message.to);
    sides = parseInt(message.match[1] || 6);
    if (sides === 0) {
      return say(message.to, "" + message.from + " I cannot make the warp core stabalizers divide by 0!");
    } else {
      return say(message.to, "" + message.from + " rolls a " + sides + " sided die and gets " + (Math.floor(Math.random() * sides) + 1));
    }
  });
  hear(/^is (.*) up/, function(message) {
    var url;
    seen.setSeenUser(message.from, message.to);
    url = message.match[1];
    return isup.isItUp(url, function(err, msg) {
      if (err || !msg) {
        return say(message.to, "" + message.from + ": " + err);
      } else {
        return say(message.to, "" + message.from + ": " + msg);
      }
    });
  });
  hear(/.*/, function(message) {
    return seen.setSeenUser(message.from, message.to);
  });
  listen();
}).call(this);
