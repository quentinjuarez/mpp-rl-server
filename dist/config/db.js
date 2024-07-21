"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async () => {
    try {
        mongoose_1.default.set("strictQuery", false);
        mongoose_1.default.Promise = bluebird_1.default;
        // @ts-ignore
        mongoose_1.default.connect(process.env.MONGODB_URI).then(() => {
            logger_1.default.info("Database connected.");
        });
    }
    catch (error) {
        logger_1.default.error("MongoDB connection error.\n" + error);
        process.exit(1);
    }
};
exports.default = connectDB;
