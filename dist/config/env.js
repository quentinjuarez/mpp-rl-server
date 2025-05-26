"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredEnvVariables = void 0;
const logger_1 = __importDefault(require("./logger"));
exports.requiredEnvVariables = [
    "PORT",
    "API_KEY",
    "APP_ID",
    "LOG_LEVEL",
    "NODE_ENV",
    "MONGODB_URI",
    "FRONT_URL",
    "BACK_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "PANDASCORE_TOKEN",
];
const checkEnvVariables = () => {
    let failed = false;
    for (const envVariable of exports.requiredEnvVariables) {
        if (!process.env[envVariable]) {
            logger_1.default.error(`Missing required environment variable: ${envVariable}`);
            failed = true;
        }
    }
    if (failed) {
        process.exit(1);
    }
};
exports.default = checkEnvVariables;
