import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRouter from "./routes/contact";
import agentRouter from "./routes/agent";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
}));
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/contact", contactRouter);
app.use("/api/agent", agentRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});