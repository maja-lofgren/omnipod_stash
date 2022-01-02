//webserver
const express = require('express');
const path = require('path');

//websocket: https://devcenter.heroku.com/articles/node-websockets
// const { Server } = require('ws');
const WebSocket = require("ws");

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const INDEX = path.resolve(__dirname, '../react-ui/build', 'index.html');

//We need an HTTP server to do two things: 
//serve our client-side assets and provide a hook for the WebSocket server to monitor for requests
// const app = express()
//   .use((req, res) => res.sendFile(INDEX))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

const app = express(); //duger ej för websockets: 

//*************** Webserver **************************** 

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  //response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  response.sendFile(INDEX);
});

app.listen(PORT, function () {
  console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
});

//*************** Websocket ****************************
function setupWebSocket(server) {
  // ws instance
  const wss = new WebSocket.Server({ noServer: true });

  // handle upgrade of the request
  server.on("upgrade", function upgrade(request, socket, head) {
    try {
       // authentication and some other steps will come here
       // we can choose whether to upgrade or not

       wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request);
       });
    } catch (err) {
      console.log("upgrade exception", err);
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
  });

  // what to do after a connection is established
  wss.on("connection", (ctx) => {
    // print number of active connections
    console.log("connected", wss.clients.size);

    // handle message events
    // receive a message and echo it back
    ctx.on("message", (message) => {
      console.log(`Received message => ${message}`);
      ctx.send(`you said ${message}`);
    });

    // handle close event
    ctx.on("close", () => {
      console.log("closed", wss.clients.size);
    });

    // sent a message that we're good to proceed
    ctx.send("connection established.");
  });
}
// const server = http.createServer(app);
setupWebSocket(app);

// const wss = new Server({ noServer: true });

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });

// //push to clients on interval: 
// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);








// const http = require('http');
// const port = process.env.PORT || 3000

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');
//   res.end('<h1>Hello Worlds</h1>');
// });

// server.listen(port,() => {
//   console.log(`Server running at port `+port);
// });