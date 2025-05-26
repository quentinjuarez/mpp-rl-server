import { Router } from "express";

import {
  getRunning,
  getAll,
  getUpcoming,
  getPast,
  getById,
} from "./controller";
import isAuth from "../../middlewares/isAuth";
import attachServices from "../../middlewares/services";

const router = Router();

router.get("/", isAuth, attachServices, getAll);
router.get("/running", isAuth, attachServices, getRunning);
router.get("/upcoming", isAuth, attachServices, getUpcoming);
router.get("/past", isAuth, attachServices, getPast);
router.get("/:id", isAuth, attachServices, getById);

export default router;
