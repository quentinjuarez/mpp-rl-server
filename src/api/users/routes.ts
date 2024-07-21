import { Router } from "express";

import { getMe, updateMe, updatePassword, checkUsername } from "./controller";
import isAuth from "../../middlewares/isAuth";
import sanitizeString from "../../middlewares/sanitizeString";
import attachServices from "../../middlewares/services";
import rateLimiter from "../../middlewares/rateLimiter";

const router = Router();

router.get("/me", isAuth, attachServices, getMe);
router.post(
  "/me",
  isAuth,
  sanitizeString(["username"]),
  attachServices,
  updateMe,
);
router.post(
  "/me/password",
  rateLimiter,
  isAuth,
  attachServices,
  updatePassword,
);
router.post("/username/check", isAuth, attachServices, checkUsername);

export default router;
