(function() {
  var desc, descriptions, dispatch, env, error, fortune, github, handlers, hear, image, irc, irc_channels, irc_name, irc_server, listen, say, seen, success, sys, weather;
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
  dispatch = function(message) {
    var handler, match, pair, pattern, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      pair = handlers[_i];
      pattern = pair[0], handler = pair[1];
      _results.push(message.from !== irc_name && (match = message.match(pattern)) ? (message.match = match, handler(message)) : void 0);
    }
    return _results;
  };
  desc = function(phrase, functionality) {
    return descriptions[phrase] = functionality;
  };
  hear = function(pattern, callback) {
    return handlers.push([pattern, callback]);
  };
  say = function(channels, message) {
    var chan, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = channels.length; _i < _len; _i++) {
      chan = channels[_i];
      _results.push(client.say(chan, message));
    }
    return _results;
  };
  listen = function() {
    var client, opts;
    opts = {
      autoRejoin: true,
      channels: irc_channels,
      debug: true,
      realName: irc_name,
      userName: irc_name
    };
    client = new irc.Client(irc_server, irc_name, opts);
    client.addListener('message', function(from, to, message) {
      dispatch(message);
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
    return console.log('weather:ok => heard "weather me"');
  });
  hear(/image me (.*)/i, function(message) {
    return console.log('image:ok => heard "image me"');
  });
  hear(/commit me (.*) (.*)/i, function(message) {
    return console.log('commit:ok => heard "commit me"');
  });
  hear(/fortune me/i, function(message) {
    return console.log('fortune:ok => heard "fortune me"');
  });
  hear(/seen (\w+)$/i, function(message) {
    return console.log('seen:ok => heard "seen"');
  });
  hear(/roll me/i, function(message) {
    return console.log('roll:ok => heard "roll me"');
  });
}).call(this);
