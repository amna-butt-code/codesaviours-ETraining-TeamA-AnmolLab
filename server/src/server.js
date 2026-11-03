import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import api from "./routes/api.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));
app.use("/api/ai", rateLimit({ windowMs: 60 * 60 * 1000, limit: 20 }));
app.use("/api", api);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`Anmol Lab API running on ${port}`)))
  .catch(err => { console.error(err); process.exit(1); });
