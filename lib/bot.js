(function() {
  var CHANNELS, NAME, SERVER, client, env, error, fortune, github, handle, image, info, irc, opts, seen, speak, sys, weather;
  irc = require('irc');
  sys = require('sys');
  env = process.env;
  weather = require('./weather');
  image = require('./image');
  github = require('./github');
  fortune = require('./fortune');
  seen = require('./seen');
  SERVER = env.IRC_SERVER;
  NAME = env.IRC_NAME;
  CHANNELS = env.IRC_CHANNELS.split(';');
  opts = {
    autoRejoin: true,
    channels: CHANNELS,
    debug: true,
    realName: NAME,
    userName: NAME
  };
  client = new irc.Client(SERVER, NAME, opts);
  handle = function(type, func) {
    return client.addListener(type, func);
  };
  speak = function(chan, msg) {
    return client.say(chan, msg);
  };
  info = function(msg) {
    return console.log("\033[01;32m" + msg + "\033[0m");
  };
  error = function(msg) {
    return console.log("\033[01;31m" + msg + "\033[0m");
  };
  handle('message', function(from, to, msg) {
    var location, phrase, proj, user, wanted;
    info("" + from + " => " + to + ": " + msg);
    if (wanted = msg.match(/weather me (.*)/i)) {
      seen.setSeenUser(from, to);
      location = wanted[1];
      weather.getWeather(location, function(err, weather) {
        if (err || !weather) {
          error("weather:error => " + err);
          return speak(to, "Could not find weather for: " + location);
        } else {
          speak(to, "Current: " + weather.current);
          speak(to, "Today: " + weather.today);
          return speak(to, "Tomorrow: " + weather.tomorrow);
        }
      });
    }
    if (wanted = msg.match(/image me (.*)/i)) {
      seen.setSeenUser(from, to);
      phrase = wanted[1];
      image.getImage(phrase, function(err, img) {
        if (err || !img) {
          error("image:error => " + err);
          return speak(to, "Could not find image for: " + phrase);
        } else {
          return speak(to, img);
        }
      });
    }
    if (wanted = msg.match(/commit me (.*) (.*)/i)) {
      seen.setSeenuser(from, to);
      user = wanted[1];
      proj = wanted[2];
      github.getLatestCommit(user, proj, function(err, commit) {
        if (err || !commit) {
          error("github:error => " + err);
          return speak(to, "Could not get latest commit for: " + user + "/" + proj);
        } else {
          return speak(to, "" + commit.author + " commited '" + commit.message + "' to " + user + "/" + proj + " on " + commit.date);
        }
      });
    }
    if (msg.match(/fortune me/i)) {
      seen.setSeenUser(from, to);
      fortune.getFortune(function(err, data) {
        if (err || !data) {
          error("fortune:error => " + err);
          return speak(to, "Could not get fortune");
        } else {
          return speak(to, data);
        }
      });
    }
    if (wanted = msg.match(/seen (\w+)$/i)) {
      seen.setSeenUser(from, to);
      user = wanted[1];
      return seen.getSeenUser(user, function(err, at) {
        if (err || !at) {
          return speak(to, "" + from + ": " + err);
        } else {
          return speak(to, "" + from + ": " + at);
        }
      });
    }
  });
  handle('error', function(msg) {
    return error(msg);
  });
}).call(this);
