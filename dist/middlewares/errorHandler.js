"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const logger_1 = __importDefault(require("../config/logger"));
const ERROR_MAP = {
    BAD_REQUEST: { statusCode: 400, message: "Bad Request" },
    UNAUTHORIZED: { statusCode: 401, message: "Unauthorized" },
    FORBIDDEN: { statusCode: 403, message: "Forbidden" },
    NOT_FOUND: { statusCode: 404, message: "Not Found" },
    INTERNAL_SERVER_ERROR: { statusCode: 500, message: "Internal Server Error" },
};
function errorHandler(error, _req, res, _next) {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
        logger_1.default.error(error);
    }
    const { statusCode, message } = (error.message && ERROR_MAP[error.message]) ||
        ERROR_MAP.INTERNAL_SERVER_ERROR;
    return res
        .status(statusCode)
        .json(isDev ? { statusCode, message, stack: error.stack } : message)
        .end();
}
