import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import AppError from "./utils/appError.util.js";
import globalErrorHandler from "./controllers/error.controller.js";
import projectRoutes from './routes/project.route.js'

import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "healthy server",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);

app.use(/.*/, (req, res, next) => {
  return next(
    new AppError(`can't find ${req.originalUrl} on this server`, 404),
  );
});

app.use(globalErrorHandler);

export default app;
