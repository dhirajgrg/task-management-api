import User from "../models/user.model.js";
import AppError from "../utils/appError.util.js";
import { generateToken } from "../utils/jwt.util.js";
import catchAsync from "../utils/catchAsync.util.js";

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("please provide name, email and password", 400));
  }

  const user = await User.create({ name, email, password });
  if (!user) {
    return next(new AppError("failed to create user", 500));
  }
  const token = generateToken({ id: user._id, role: user.role });

  user.password = undefined;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("invalid email or password", 401));
  }
  const token = generateToken({ id: user._id, role: user.role });
  if (!token) {
    return next(new AppError("failed to generate token", 500));
  }

  user.password = undefined;
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
};

export const getMe = (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: "success",
    data: { user },
  });
};
