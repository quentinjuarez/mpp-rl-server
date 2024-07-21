import { Router } from "express";

import { login, register } from "./controller";
import rateLimiter from "../../middlewares/rateLimiter";
import sanitizeString from "../../middlewares/sanitizeString";

import passport from "passport";
import attachServices from "../../middlewares/services";

const router = Router();

router.post("/login", attachServices, login);
router.post(
  "/register",
  rateLimiter,
  sanitizeString(["firstName", "lastName"]),
  attachServices,
  register,
);

router.get(
  "/google",
  passport.authenticate("google-sso", {
    session: false,
    scope: ["profile", "email"],
  }),
);
router.get(
  "/google/callback/",
  passport.authenticate("google-sso", { session: false }),
  (req, res) => {
    return res.status(200).json(req.user).end();
  },
);

export default router;
