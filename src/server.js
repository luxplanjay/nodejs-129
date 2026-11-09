import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { readFile } from "node:fs/promises";
import "dotenv/config";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import studentsRoutes from "./routes/studentsRoutes.js";

const spec = JSON.parse(
  await readFile(new URL("../docs/openapi.json", import.meta.url), "utf8"),
);

const app = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors({ origin: "*" }));
// Додає хедери базовоі безпеки
app.use(helmet());
// Додає req.body
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(studentsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
