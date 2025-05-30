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
const routes_5 = __importDefault(require("./matches/routes"));
const routes_6 = __importDefault(require("./series/routes"));
const routes_7 = __importDefault(require("./tournaments/routes"));
const apiRouter = express_1.default.Router();
apiRouter.use("/auth", routes_1.default);
apiRouter.use("/users", routes_2.default);
apiRouter.use("/forecasts", routes_3.default);
apiRouter.use("/proxy", routes_4.default);
apiRouter.use("/matches", routes_5.default);
apiRouter.use("/series", routes_6.default);
apiRouter.use("/tournaments", routes_7.default);
exports.default = apiRouter;
