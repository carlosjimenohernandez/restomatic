// Create server
Create_server: {

  const http = require("http");
  const server = http.createServer(Restomatic.application);
  Restomatic.server = server;

}