import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRouter from "./routes/contact";
import agentRouter from "./routes/agent";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const PORT = process.env.PORT ?? 3001;

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: { success: false, message: "Trop de requêtes, réessayez dans 15 minutes." },
});

const agentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Trop de requêtes, réessayez dans 15 minutes." },
});

const requiredEnv = ["ANTHROPIC_API_KEY", "RESEND_API_KEY", "CONTACT_EMAIL"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Variable d'environnement manquante : ${key}`);
    process.exit(1);
  }
});

const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "50kb" }));
app.use(helmet());

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/contact", contactLimiter, contactRouter);
app.use("/api/agent", agentLimiter, agentRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});