import express from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";
import forecastRoutes from "./forecasts/routes";

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/forecasts", forecastRoutes);

export default apiRouter;
