import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

const app = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors({ origin: "*" }));

// Додає хедери базовоі безпеки
app.use(helmet());

// Додає req.body
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request: ", req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log("Time: ", new Date().toLocaleTimeString());
  next();
});

app.get("/error", (req, res) => {
  throw new Error("test error!");
});

// GET /students
app.get("/students", (req, res) => {
  res.status(200).json([]);
});

// GET /students/:studentId
app.get("/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  res.status(200).json({ id: studentId });
});

// POST /students
app.post("/students", (req, res) => {
  res.status(201).json({
    id: Date.now(),
    ...req.body,
  });
});

// PATCH /students/:studentId
app.patch("/students/:studentId", (req, res) => {
  res.status(200).json({});
});

// DELETE /students/:studentId
app.delete("/students/:studentId", (req, res) => {
  res.status(200).json({});
});

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found!" });
});

app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd ? "Oops something went wrong!" : err.stack,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
