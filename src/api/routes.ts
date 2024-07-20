import express from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";
import drawingRoutes from "./drawings/routes";

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/drawings", drawingRoutes);

export default apiRouter;
