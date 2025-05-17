import { Router } from "express";

import { getRunning } from "./controller";
import isAuth from "../../middlewares/isAuth";
import attachServices from "../../middlewares/services";

const router = Router();

router.get("/running", isAuth, attachServices, getRunning);

export default router;
