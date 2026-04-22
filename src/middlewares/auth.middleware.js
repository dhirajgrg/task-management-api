import User from "../models/user.model.js";
import AppError from "../utils/appError.util.js";
import { verifyToken } from "../utils/jwt.util.js";
import catchAsync from "../utils/catchAsync.util.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError("you are not logged in! please log in to get access", 401),
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new AppError("invalid token! please log in again", 401));
  }
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "the user belonging to this token does no longer exist",
        401,
      ),
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed password! please log in again", 401),
    );
  }

  req.user = currentUser;
  next();
});



export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you are not allowed to perform this action", 403)
      );
    }
    next();
  };
};
