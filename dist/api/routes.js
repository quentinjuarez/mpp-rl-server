"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./auth/routes"));
const routes_2 = __importDefault(require("./users/routes"));
const routes_3 = __importDefault(require("./forecasts/routes"));
const routes_4 = __importDefault(require("./proxy/routes"));
const apiRouter = express_1.default.Router();
apiRouter.use("/auth", routes_1.default);
apiRouter.use("/users", routes_2.default);
apiRouter.use("/forecasts", routes_3.default);
apiRouter.use("/proxy", routes_4.default);
exports.default = apiRouter;
