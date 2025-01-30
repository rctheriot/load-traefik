const WebSocket = require("ws");
const http = require("http");
const PORT = 3002;
const express = require("express");
const app = express();

// Get docker container name
const os = require("os");
const hostname = os.hostname();

const { SAGEBase } = require("@sage3/sagebase");

let COLLECTION_TODOS = null;
async function startServer() {
  // Initialization of SAGEBase
  const sbConfig = {
    projectName: "SAGE3",
    redisUrl: "redis://redis:6379",
  };
  await SAGEBase.init(sbConfig, app);

  COLLECTION_TODOS = await SAGEBase.Database.collection("TODOS");

  // Create WebSocket server
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    console.log("Client connected");

    COLLECTION_TODOS.subscribe((change) => {
      ws.send(JSON.stringify({ type: "subscription", data: change }));
    });

    ws.on("message", (message) => {
      // Echo the message back
      ws.send(`Echo: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });

    ws.send(
      JSON.stringify({
        type: "status",
        data: {
          status: "OK",
          server: os.hostname(),
          timestamp: new Date().toISOString(),
        },
      })
    );
  });

  // Start HTTP server on port 3002
  server.listen(PORT, () => {
    console.log("WebSocket server running on port 3002");
  });
}

startServer();
