// API To query backend

async function getStatus() {
  const response = await fetch("/api/status");
  const json = await response.json();
  console.log(json);
  return json;
}
