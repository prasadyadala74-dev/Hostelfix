import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";

dotenv.config();

const app = express();

// Trust proxy for Vercel edge/serverless headers
app.set("trust proxy", 1);

// Configure CORS
const ALLOWED_ORIGINS = [
  "https://hostelfix-kappa.vercel.app",
  "http://localhost:5173",
  "http://localhost:5000",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:3000"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// URL Normalization Middleware for Vercel serverless functions
app.use((req, res, next) => {
  if (req.url.startsWith("/api/index.js")) {
    req.url = req.url.replace(/^\/api\/index\.js/, "") || "/";
  } else if (req.url.startsWith("/api/index")) {
    req.url = req.url.replace(/^\/api\/index/, "") || "/";
  } else if (req.url.startsWith("/index.js")) {
    req.url = req.url.replace(/^\/index\.js/, "") || "/";
  }
  next();
});

// Database connection middleware for serverless & traditional servers
app.use(async (req, res, next) => {
  // Allow health checks to respond immediately without DB dependency
  const path = req.path.replace(/\/+$/, "") || "/";
  if (path === "/health" || path === "/api/health" || path === "/" || path === "/api") {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection middleware error:", err.message);
    res.status(500).json({
      message: "Database connection failed. Please ensure MONGODB_URI is set in Vercel environment variables and 0.0.0.0/0 is allowed in MongoDB Atlas Network Access.",
      error: process.env.NODE_ENV === "production" ? undefined : err.message
    });
  }
});

// Health check endpoints
const healthHandler = (_, res) =>
  res.json({
    ok: true,
    service: "HostelFix API",
    status: "running",
    timestamp: new Date().toISOString(),
    environment: {
      MONGODB_URI_CONFIGURED: !!process.env.MONGODB_URI,
      JWT_SECRET_CONFIGURED: !!process.env.JWT_SECRET
    }
  });

app.get("/api/health", healthHandler);
app.get("/health", healthHandler);
app.get("/api", healthHandler);
app.get("/", healthHandler);

// Route handlers mapped to both /api/* and /* for full compatibility with Vercel rewrites
const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/complaints", complaintRoutes);

app.use("/api", apiRouter);
app.use("/", apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl || req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled API error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

export default app;
