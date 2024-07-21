import express from "express";
import dotenv from "dotenv";
dotenv.config();

// import favicon from "serve-favicon";
// import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import passport from "passport";
import connectDB from "./config/db";
import l from "./config/logger";
import errorHandler from "./middlewares/errorHandler";
import { corsOptions } from "./config/constant";
import checkEnvVariables from "./config/env";
import apiRoutes from "./api/routes";
import initGoogleStrategy from "./middlewares/google";
import sessionMiddleware from "./config/session";

checkEnvVariables();

const app = express();

connectDB();

// Express configuration
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.NODE_ENV === "development" ? "*" : corsOptions,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.text({ limit: "100kb" }));
app.use(helmet());
app.use(mongoSanitize());
app.disable("x-powered-by");
// app.use(favicon(path.join(__dirname, "assets", "favicon.ico")));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
initGoogleStrategy();

// Routes
app.get("/", (_req, res) => {
  res.json({ message: `${process.env.APP_ID} is healthy` });
});
app.use("/api", apiRoutes);

app.use(errorHandler);

// Start server
const port = parseInt(process.env.PORT || "4001");
const server = app.listen(port, () => {
  const address = server.address();

  if (!address || typeof address === "string") process.exit(1);

  const url = `http://${
    address.address === "::" ? "localhost" : address.address
  }:${address.port}`;

  l.info(`Running in ${process.env.NODE_ENV} at: ${url}`);
});
