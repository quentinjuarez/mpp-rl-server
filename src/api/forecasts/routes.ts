import { Router } from "express";
import { createOrUpdate, getAll, getPoints, getByMatchId } from "./controller";
import isAuth from "../../middlewares/isAuth";
import attachServices from "../../middlewares/services";

const router = Router();

router.get("/", isAuth, attachServices, getAll);
router.post("/", isAuth, attachServices, createOrUpdate);
router.get("/points", isAuth, attachServices, getPoints);
router.get("/:matchId", isAuth, attachServices, getByMatchId);

export default router;
