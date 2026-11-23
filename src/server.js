import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { readFile } from "node:fs/promises";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import studentsRoutes from "./routes/studentsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const spec = JSON.parse(
  await readFile(new URL("../docs/openapi.json", import.meta.url), "utf8"),
);

const app = express();

// Adds headers: Access-Control-Allow-Origin: *
// app.use(cors({ origin: "*" }));
app.use(cors());
// Додає хедери базовоі безпеки
app.use(helmet());
// Додає req.body
// app.use(express.json({limit: "100kb"}));
app.use(express.json());

// Додає req.cookies
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(authRoutes);
app.use(studentsRoutes);

app.use(notFoundHandler);
// celebrate error handler
app.use(errors());
// custom error handler
app.use(errorHandler);

await connectMongoDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
