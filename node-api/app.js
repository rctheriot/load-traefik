const express = require("express");
const os = require("os");
const app = express();
const port = 3000;

// API route for server status
app.get("/api/status", (req, res) => {
  res.send({
    status: "OK",
    server: os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Webapp Server running on port ${port}`);
});
