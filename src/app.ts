import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { port } from "../config";
import { routes } from "./routes";

const app = express();
export const prisma = new PrismaClient();

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`💫 server running on port ${port}`);
});
