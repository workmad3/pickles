(function() {
  var CHANNELS, NAME, SERVER, client, env, error, handle, image, info, irc, speak, sys, weather;
  irc = require('irc');
  sys = require('sys');
  env = process.env;
  weather = require('./weather');
  image = require('./image');
  SERVER = env.IRC_SERVER;
  NAME = env.IRC_NAME;
  CHANNELS = env.IRC_CHANNELS.split(';');
  client = new irc.Client(SERVER, NAME, {
    autoRejoin: true,
    channels: CHANNELS,
    debug: true,
    realName: NAME,
    userName: NAME
  });
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
    var location, phrase, wanted;
    info("" + from + " => " + to + ": " + msg);
    if (wanted = msg.match(/weather me (.*)/i)) {
      location = wanted[1];
      weather.getWeather(location, function(err, weather) {
        if (err || !weather) {
          error("weather:error => " + err);
          return speak(to, "Could not find weather for: " + location);
        } else {
          speak(to, "Current: " + weather[0]);
          speak(to, "Today: " + weather[1]);
          return speak(to, "Tomorrow: " + weather[2]);
        }
      });
    }
    if (wanted = msg.match(/image me (.*)/i)) {
      phrase = wanted[1];
      return image.getImage(phrase, function(err, img) {
        if (err || !img) {
          error("image:error => " + err);
          return speak(to, "Could not find image for: " + phrase);
        } else {
          return speak(to, img);
        }
      });
    }
  });
  handle('error', function(msg) {
    return error(msg);
  });
}).call(this);
