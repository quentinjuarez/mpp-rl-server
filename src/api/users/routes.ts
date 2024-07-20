import { Router } from "express";

import { getMe, updateMe, deleteMe } from "./controller";
import isAuth from "../../middlewares/isAuth";
import sanitizeString from "../../middlewares/sanitizeString";

const router = Router();

router.get("/me", isAuth, getMe);
router.post("/me", isAuth, sanitizeString(["username"]), updateMe);
router.delete("/me", isAuth, deleteMe);

export default router;
