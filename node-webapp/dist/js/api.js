// API To query backend

async function getStatus() {
  const response = await fetch("/api/status");
  const json = await response.json();
  console.log(json);
  return json;
}

// API Post TODO to backend

async function postTodo() {
  const todo = {
    title: "New Todo",
    description: "This is a new todo",
  };
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  const json = await response.json();
  console.log(json);
  return json;
}

// API Get TODOs from backend
async function getTodos() {
  const response = await fetch("/api/todos");
  const json = await response.json();
  console.log(json);
  return json;
}

// Subscribe to TODOS collection changes
// const protocol = window.location.protocol === "https:" ? "wss" : "ws";
// const ws = new WebSocket(`${protocol}://${window.location.hostname}`);
// ws.onopen = () => {
//   console.log("WebSocket connected");
// };
// ws.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   console.log("Received data:", data);
// };
// ws.onerror = (error) => {
//   console.error("WebSocket error:", error);
// };
// ws.onclose = () => {
//   console.log("WebSocket disconnected");
// };
