import express from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);

export default apiRouter;
