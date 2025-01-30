const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Serve the 'dist' folder statically
app.use(express.static(path.join(__dirname, "dist")));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Webapp Server running on port ${port}`);
});
