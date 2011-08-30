(function() {
  var http, port, server;
  http = require('http');
  server = http.createServer(function(request, response) {
    response.writeHead(200, {
      "Content-Type": "text/plain"
    });
    return response.end("Node.js IRC bot pickles");
  });
  port = process.env.PORT || 3000;
  server.listen(port);
}).call(this);
