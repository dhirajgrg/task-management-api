import AppError from "../utils/appError.util.js";

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
  
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  console.error("ERROR 💥", error);

  return res.status(500).json({
    status: "error",
    message: "something went wrong",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  // 🔥 Handle specific errors FIRST
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    error = new AppError(message, 400);
  }

  if (error.code === 11000) {
    const message = `Duplicate field value: ${JSON.stringify(error.keyValue)}`;
    error = new AppError(message, 400);
  }

  if (error.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again!", 401);
  }

  if (error.name === "TokenExpiredError") {
    error = new AppError("Token expired. Please log in again.", 401);
  }

  if (error.name === "CastError") {
    const message = `Invalid ${error.path}: ${error.value}`;
    error = new AppError(message, 400);
  }

  // 🔥 THEN send response
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(error, res);
    
  
  }

  if (process.env.NODE_ENV === "production") {
    return sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
