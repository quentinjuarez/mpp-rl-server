import express from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";
import forecastRoutes from "./forecasts/routes";
import proxyRoutes from "./proxy/routes";

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/forecasts", forecastRoutes);
apiRouter.use("/proxy", proxyRoutes);

export default apiRouter;
