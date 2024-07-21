"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import favicon from "serve-favicon";
// import path from "path";
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./config/logger"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const constant_1 = require("./config/constant");
const env_1 = __importDefault(require("./config/env"));
const routes_1 = __importDefault(require("./api/routes"));
const google_1 = __importDefault(require("./middlewares/google"));
const session_1 = __importDefault(require("./config/session"));
(0, env_1.default)();
const app = (0, express_1.default)();
(0, db_1.default)();
// Express configuration
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "development" ? "*" : constant_1.corsOptions,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: "100kb" }));
app.use(express_1.default.text({ limit: "100kb" }));
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.disable("x-powered-by");
// app.use(favicon(path.join(__dirname, "assets", "favicon.ico")));
app.use(session_1.default);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, google_1.default)();
// Routes
app.get("/", (_req, res) => {
    res.json({ message: `${process.env.APP_ID} is healthy` });
});
app.use("/api", routes_1.default);
app.use(errorHandler_1.default);
// Start server
const port = parseInt(process.env.PORT || "4001");
const server = app.listen(port, () => {
    const address = server.address();
    if (!address || typeof address === "string")
        process.exit(1);
    const url = `http://${address.address === "::" ? "localhost" : address.address}:${address.port}`;
    logger_1.default.info(`Running in ${process.env.NODE_ENV} at: ${url}`);
});
