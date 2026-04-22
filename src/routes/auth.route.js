import { Router } from "express";
import { registerValidator } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", registerValidator, validate, signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
``;
