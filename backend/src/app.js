import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./routes/auth.routes.js";
import { menuRouter } from "./routes/menu.routes.js";

export function createApp() {
  const app = express();
  const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || origin === allowedOrigin) {
          callback(null, true);
          return;
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "20kb" }));
  app.use(morgan("tiny"));

  app.get("/health", (_request, response) => {
    response.json({ status: "ok", service: "hush-lush-api" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/menu", menuRouter);

  app.use((_request, response) => {
    response.status(404).json({ message: "Route not found" });
  });

  app.use((error, _request, response, _next) => {
    response.status(error.status || 500).json({
      message: error.message || "Something went wrong"
    });
  });

  return app;
}
