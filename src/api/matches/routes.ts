import { Router } from "express";

import { getPast, getUpcoming, get, getAll, getRunning } from "./controller";
import isAuth from "../../middlewares/isAuth";
import attachServices from "../../middlewares/services";

const router = Router();

router.get("/", isAuth, attachServices, getAll);
router.get("/past", isAuth, attachServices, getPast);
router.get("/upcoming", isAuth, attachServices, getUpcoming);
router.get("/running", isAuth, attachServices, getRunning);
router.get("/:id", isAuth, attachServices, get);

export default router;
