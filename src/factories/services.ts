import { Request } from "express";
import type { Logger } from "pino";
import logger from "../config/logger";
import AuthService from "../api/auth/service";
import UserService from "../api/users/service";
import ForecastService from "../api/forecasts/service";

class ServicesFactory {
  userId: string;
  logger: Logger;

  auth?: AuthService;
  users?: UserService;
  forecasts?: ForecastService;

  constructor(req: Request) {
    this.userId = req.auth?.userId;
    this.logger = logger.child({ userId: this.userId });
  }

  static init(req: Request) {
    return new ServicesFactory(req);
  }

  authService() {
    if (!this.auth) {
      this.auth = new AuthService({
        logger: this.logger.child({ service: "AuthService" }),
      });
    }
    return this.auth;
  }

  userService() {
    if (!this.users) {
      this.users = new UserService({
        logger: this.logger.child({ service: "UserService" }),
        userId: this.userId,
      });
    }
    return this.users;
  }

  forecastService() {
    if (!this.forecasts) {
      this.forecasts = new ForecastService({
        logger: this.logger.child({ service: "ForecastService" }),
        userId: this.userId,
      });
    }
    return this.forecasts;
  }
}

export default ServicesFactory;
