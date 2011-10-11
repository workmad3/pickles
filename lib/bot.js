(function() {
  var bash, client, desc, descriptions, dispatch, error, fortune, github, handlers, hear, image, imdb, irc, irc_channels, irc_name, irc_server, isup, listen, say, seen, success, sys, time, weather;
  irc = require("irc");
  sys = require("sys");
  bash = require("./bash");
  fortune = require("./fortune");
  github = require("./github");
  image = require("./image");
  imdb = require("./imdb");
  isup = require("./isitup");
  seen = require("./seen");
  time = require("./time");
  weather = require("./weather");
  irc_server = process.env.IRC_SERVER;
  irc_name = process.env.IRC_NAME;
  irc_channels = process.env.IRC_CHANNELS.split(";");
  handlers = [];
  descriptions = [];
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
  desc = function(phrase, functionality) {
    return descriptions[phrase] = functionality;
  };
  say = function(channel, message) {
    return client.say(channel, message);
  };
  success = function(message) {
    return console.log("\033[01;32m" + message + "\033[0m");
  };
  error = function(message) {
    return console.log("\033[01;31m" + message + "\033[0m");
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
  hear(/^pickles: help/i, function(message) {
    var functionality, phrase, _results;
    say(message.from, "I listen for the following...");
    _results = [];
    for (phrase in descriptions) {
      functionality = descriptions[phrase];
      _results.push(say(message.from, "" + phrase + " => " + functionality));
    }
    return _results;
  });
  desc('weather me :place', 'Get the weather for now, today and tomorrow for :place');
  hear(/^weather me (.*)/i, function(message) {
    var location;
    seen.setSeenUser(message.from, message.to);
    location = message.match[1];
    return weather.getWeather(location, function(err, weather) {
      if (err || !weather) {
        return say(message.to, "Could not find weather for '" + location + "'");
      } else {
        say(message.to, "Current: " + weather.current);
        say(message.to, "Today: " + weather.today);
        return say(message.to, "Tomorrow: " + weather.tomorrow);
      }
    });
  });
  desc('image me :phrase', 'Get a random image from Google Images for the search :phrase');
  hear(/^image me (.*)$/i, function(message) {
    var phrase;
    seen.setSeenUser(message.from, message.to);
    phrase = message.match[1];
    return image.getImage(phrase, function(err, image) {
      if (err || !image) {
        return say(message.to, "Could not find an image for '" + phrase + "'");
      } else {
        return say(message.to, image);
      }
    });
  });
  desc('commit me :user/:project', 'Get the latest commit for the GitHub repo :user/:project');
  hear(/^commit me (.*)\/(.*)/i, function(message) {
    var proj, user;
    seen.setSeenUser(message.from, message.to);
    user = message.match[1];
    proj = message.match[2];
    return github.getLatestCommit(user, proj, function(err, commit) {
      if (err || !commit) {
        return say(message.to, "Could not get latest commit for '" + user + "/" + proj + "'");
      } else {
        return say(message.to, "" + commit.author + " commited '" + commit.message + "' to " + user + "/" + proj + " on " + commit.date);
      }
    });
  });
  desc('fortune me', 'Get a poorly formatted fortune');
  hear(/fortune me/i, function(message) {
    seen.setSeenUser(message.from, message.to);
    return fortune.getFortune(function(err, fortune) {
      if (err || !fortune) {
        return say(message.to, "" + message.from + ": " + err);
      } else {
        return say(message.to, "" + message.from + ": " + fortune);
      }
    });
  });
  desc('bash me', 'Get a random quote link from bash.org');
  hear(/^bash me/i, function(message) {
    seen.setSeenUser(message.from, message.to);
    return bash.getBash(function(err, bash) {
      if (err || !bash) {
        return say(message.to, "" + message.from + ": " + err);
      } else {
        return say(message.to, "" + message.from + ": " + bash);
      }
    });
  });
  desc('seen :nick', 'Get when I last saw :nick and in which channel');
  hear(/^seen ([\w^_-|\{\}\[\]`\\]+)$/i, function(message) {
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
  desc('roll me :side', 'Get a random number based on a die roll with :sides or 6 sides');
  hear(/^roll me ?(\d*)/i, function(message) {
    var sides;
    seen.setSeenUser(message.from, message.to);
    sides = parseInt(message.match[1] || 6);
    if (sides === 0) {
      return say(message.to, "" + message.from + " I cannot make the warp core stabilizers divide by 0!");
    } else {
      return say(message.to, "" + message.from + " rolls a " + sides + " sided die and gets " + (Math.floor(Math.random() * sides) + 1));
    }
  });
  desc('is :domain up', 'Get the status of the website hosted at :domain');
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
  desc('what is the time in :place', 'Get the current time in :place');
  hear(/^what is the time in (.*)/i, function(message) {
    var place;
    seen.setSeenUser(message.from, message.to);
    place = message.match[1];
    return time.getTime(place, function(err, msg) {
      if (err || !msg) {
        return say(message.to, "" + message.from + ": " + err);
      } else {
        return say(message.to, "" + message.from + ": " + msg);
      }
    });
  });
  desc('movie me :movie_or_tv_show', 'Get the IMDb link for :movie_or_tv_show');
  hear(/^movie me (.*)/i, function(message) {
    var query;
    seen.setSeenUser(message.from, message.to);
    query = message.match[1];
    return imdb.getMovie(query, function(err, msg) {
      if (err || !msg) {
        return say(message.to, "" + message.from + ": " + err);
      } else {
        return say(message.to, "" + message.from + ": " + msg);
      }
    });
  });
  hear(/(it's|its|it was) (long|short|hard)/i, function(message) {
    seen.setSeenUser(message.from, message.to);
    return say(message.to, "That's what she said!");
  });
  desc('what are the pulls on :user/:project', 'Get the latest pull requests for the GitHub repo :user/:project');
  hear(/^what are the pulls on (.*)\/(.*)/i, function(message) {
    var proj, user;
    seen.setSeenUser(message.from, message.to);
    user = message.match[1];
    proj = message.match[2];
    return github.getPullRequests(user, proj, function(err, msg) {
      var pull, _i, _len, _results;
      if (err || !msg) {
        return say(message.to, "" + message.from + ": " + err);
      } else {
        _results = [];
        for (_i = 0, _len = msg.length; _i < _len; _i++) {
          pull = msg[_i];
          _results.push(say(message.to, "" + pull));
        }
        return _results;
      }
    });
  });
  hear(/.*/, function(message) {
    return seen.setSeenUser(message.from, message.to);
  });
  listen();
}).call(this);
