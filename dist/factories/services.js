"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const service_1 = __importDefault(require("../api/auth/service"));
const service_2 = __importDefault(require("../api/users/service"));
const service_3 = __importDefault(require("../api/forecasts/service"));
const rl_1 = __importDefault(require("../adapters/rl"));
class ServicesFactory {
    userId;
    logger;
    auth;
    users;
    forecasts;
    rl;
    constructor(req) {
        this.userId = req.auth?.userId;
        this.logger = logger_1.default.child({ userId: this.userId });
    }
    static init(req) {
        return new ServicesFactory(req);
    }
    authService() {
        if (!this.auth) {
            this.auth = new service_1.default({
                logger: this.logger.child({ service: "AuthService" }),
            });
        }
        return this.auth;
    }
    userService() {
        if (!this.users) {
            this.users = new service_2.default({
                logger: this.logger.child({ service: "UserService" }),
                userId: this.userId,
            });
        }
        return this.users;
    }
    forecastService() {
        if (!this.forecasts) {
            this.forecasts = new service_3.default({
                logger: this.logger.child({ service: "ForecastService" }),
                userId: this.userId,
                rlAdapter: this.rlAdapter(),
            });
        }
        return this.forecasts;
    }
    rlAdapter() {
        if (!this.rl) {
            this.rl = new rl_1.default();
        }
        return this.rl;
    }
}
exports.default = ServicesFactory;
