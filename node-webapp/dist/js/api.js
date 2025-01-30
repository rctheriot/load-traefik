// API To query backend

async function getStatus() {
  const response = await fetch("/api/status");
  const json = await response.json();
  const serverName = json.server;
  // Set HTTP API Server Name
  document.getElementById("api-server").innerText = `api-server: ${serverName}`;
  return json;
}

let TODOS = [];

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
  TODOS = [];
  json.forEach((doc) => {
    TODOS.push(doc);
  });
  renderTodos();
  return json;
}

//

getStatus();

// Subscribe to TODOS collection changes
const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const ws = new WebSocket(`${protocol}://${window.location.hostname}/ws`);

ws.onopen = () => {
  console.log("WebSocket connected");
  ws.send("Hello from client!");
};

ws.onmessage = (event) => {
  // Parse message
  const message = JSON.parse(event.data);
  switch (message.type) {
    case "subscription":
      parseSubMessage(message.data);
      break;
    case "status":
      console.log("Status:", message);
      const serverName = message.data.server;
      // Set WS Server Name
      document.getElementById(
        "ws-server"
      ).innerText = `ws-server: ${serverName}`;
      break;
    default:
      console.log("Unknown message type:", message);
  }
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("WebSocket disconnected");
};

function renderTodos() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  TODOS.forEach((todo) => {
    const title = todo.data.title;
    const id = todo._id;
    const li = document.createElement("li");
    li.innerText = `${id} - ${title}`;
    todoList.appendChild(li);
  });
}

function parseSubMessage(message) {
  switch (message.type) {
    case "CREATE":
      console.log(message);
      TODOS.push(...message.doc);
      renderTodos();
      break;
    case "UPDATE":
      break;
    case "DELETE":
      console.log("Deleted TODO:", message.data);
      break;
    default:
      console.log("Unknown message type:", message);
  }
}
