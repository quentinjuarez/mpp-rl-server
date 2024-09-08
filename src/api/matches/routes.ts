import { Router } from "express";

import { getPast, getUpcoming } from "./controller";
import isAuth from "../../middlewares/isAuth";
import attachServices from "../../middlewares/services";

const router = Router();

router.get("/past", isAuth, attachServices, getPast);
router.get("/upcoming", isAuth, attachServices, getUpcoming);

export default router;
