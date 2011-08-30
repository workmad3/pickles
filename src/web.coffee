http = require 'http'

server = http.createServer (request, response) ->
  response.writeHead 200, { "Content-Type": "text/plain" }
  response.end "Node.js IRC bot pickles"

ports = process.env.PORT or 3000
server.listen port
