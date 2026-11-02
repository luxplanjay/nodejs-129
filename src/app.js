import path from "node:path";
import fs from "node:fs/promises";
import http from "node:http";

const carsPath = path.join(
  import.meta.dirname,
  "..",
  "lessons",
  "lesson-01",
  "assets",
  "cars.json",
);

// Top level await
const carsJson = await fs.readFile(carsPath, "utf-8");
const cars = JSON.parse(carsJson);

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ data: "Hello from home route" }));
  }

  if (req.method === "GET" && req.url === "/cars") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(cars));
  }
});

server.listen(3005, () => {
  console.log("Server is running on http://localhost:3005");
});
