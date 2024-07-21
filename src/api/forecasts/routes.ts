import { Router } from "express";

import { createOrUpdate, getAll, getPoints } from "./controller";
import isAuth from "../../middlewares/isAuth";
import attachServices from "../../middlewares/services";

const router = Router();

router.get("/", isAuth, attachServices, getAll);
router.post("/", isAuth, attachServices, createOrUpdate);
router.get("/points", isAuth, attachServices, getPoints);

export default router;
