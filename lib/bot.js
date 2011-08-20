(function() {
  var CHANNELS, NAME, SERVER, client, env, irc, sys;
  irc = require('irc');
  sys = require('sys');
  env = process.env;
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
  client.addListener('raw', function(msg) {
    return console.log(msg);
  });
  client.addListener('message', function(from, to, msg) {
    return console.log("\033[01;32m" + from + ' => ' + to + ': ' + msg + "\033[0m");
  });
  client.addListener('error', function(msg) {
    return console.log("\033[01;31m" + msg + "\033[0m");
  });
}).call(this);
