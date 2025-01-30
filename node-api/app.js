const express = require("express");
const os = require("os");
const app = express();
const port = 3001;
const { SAGEBase } = require("@sage3/sagebase");

// Add this middleware to parse JSON request bodies
app.use(express.json());

let COLLECTION_TODOS = null;

async function startServer() {
  // Initialization of SAGEBase
  const sbConfig = {
    projectName: "SAGE3",
    redisUrl: "redis://redis:6379",
  };
  await SAGEBase.init(sbConfig, app);

  COLLECTION_TODOS = await SAGEBase.Database.collection("TODOS");

  // API route for getting all todos
  app.get("/api/todos", async (req, res) => {
    const docs = await COLLECTION_TODOS.getAllDocs();
    res.send(docs);
  });

  // API route for creating a new todo
  app.post("/api/todos", async (req, res) => {
    const todo = req.body;
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

  app.listen(port, () => {
    console.log(`API Server running on port ${port}`);
  });
}

startServer();
