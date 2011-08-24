(function() {
  var client, desc, descriptions, dispatch, env, error, fortune, github, handlers, hear, image, irc, irc_channels, irc_name, irc_server, listen, say, seen, success, sys, weather;
  irc = require('irc');
  sys = require('sys');
  env = process.env;
  weather = require('./weather');
  image = require('./image');
  github = require('./github');
  fortune = require('./fortune');
  seen = require('./seen');
  irc_server = env.IRC_SERVER;
  irc_name = env.IRC_NAME;
  irc_channels = env.IRC_CHANNELS.split(';');
  descriptions = {};
  handlers = [];
  client = null;
  dispatch = function(message) {
    var handler, match, pair, pattern, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      pair = handlers[_i];
      pattern = pair[0], handler = pair[1];
      _results.push(message.from !== irc_name && (match = message.message.match(pattern)) ? (message.match = match, console.log(message), handler(message)) : void 0);
    }
    return _results;
  };
  desc = function(phrase, functionality) {
    return descriptions[phrase] = functionality;
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
      debug: true,
      realName: irc_name,
      userName: irc_name
    };
    client = new irc.Client(irc_server, irc_name, opts);
    client.addListener('message', function(from, to, message) {
      var msg;
      msg = {
        from: from,
        to: to,
        message: message
      };
      dispatch(msg);
      return success("" + from + " => " + to + ": " + message);
    });
    return client.addListener('error', function(message) {
      return error(message);
    });
  };
  success = function(message) {
    return console.log("\033[01;32m" + message + "\033[0m");
  };
  error = function(message) {
    return console.log("\033[01;31m" + message + "\033[0m");
  };
  try {
    listen();
    success('Connected to server');
  } catch (err) {
    error("Error connecting to server: " + err);
  }
  hear(/weather me (.*)/i, function(message) {
    var location;
    seen.setSeenUser(message.from, message.to);
    location = message.match[1];
    return weather.getWeather(location, function(err, weather) {
      if (err || !weather) {
        err("weather:error => " + err);
        return say(message.to, "Could not find weather for '" + location + "'");
      } else {
        say(message.to, "Current: " + weather.current);
        say(message.to, "Today: " + weather.today);
        return say(message.to, "Tomorrow: " + weather.tomorrow);
      }
    });
  });
  hear(/image me (.*)/i, function(message) {
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
  hear(/commit me (.*) (.*)/i, function(message) {
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
    console.log('fortune:ok => heard "fortune me"');
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
  hear(/seen (\w+)$/i, function(message) {
    return console.log('seen:ok => heard "seen"');
  });
  hear(/roll me/i, function(message) {
    return console.log('roll:ok => heard "roll me"');
  });
}).call(this);
