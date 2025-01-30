const express = require("express");
const os = require("os");
const app = express();
const port = 3000;
const { SAGEBase } = require("@sage3/sagebase");
const { createServer } = require("http");
const ws = require("ws");

// Add this middleware to parse JSON request bodies
app.use(express.json());

const COLLECTION_TODOS = null;

async function startServer() {
  // Initialization of SAGEBase
  const sbConfig = {
    projectName: "SAGE3",
    redisUrl: "redis://redis:6379",
  };
  await SAGEBase.init(sbConfig, app);

  const COLLECTION_TODOS = await SAGEBase.Database.collection("TODOS");

  // API route for getting all todos
  app.get("/api/todos", async (req, res) => {
    const docs = await COLLECTION_TODOS.getAllDocs();
    const todos = docs.map((doc) => doc.data);
    res.send(todos);
  });

  // API route for creating a new todo
  app.post("/api/todos", async (req, res) => {
    const todo = req.body;
    console.log(todo);
    const doc = await COLLECTION_TODOS.addDoc(todo, "TODO");
    const d = await doc.read();
    res.json({ success: true, data: d });
  });

  // API route for server status
  app.get("/api/status", (req, res) => {
    res.send({
      status: "OK",
      server: os.hostname(),
      timestamp: new Date().toISOString(),
    });
  });

  // Create an HTTP server and attach WebSocket
  const server = createServer(app);
  const wss = new ws.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connected");

    if (!COLLECTION_TODOS) {
      console.error("COLLECTION_TODOS is not initialized");
      ws.close();
      return;
    }

    const unsubscribe = COLLECTION_TODOS.subscribe((doc) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(doc.data));
      }
    });

    ws.on("close", () => {
      unsubscribe();
      console.log("WebSocket disconnected");
    });
  });

  // Handle WebSocket upgrades
  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  server.listen(port, () => {
    console.log(`Webapp Server running on port ${port}`);
  });
}

startServer();
