"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
// Set up session middleware with MongoStore
const sessionStore = connect_mongo_1.default.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60, // Session TTL in seconds (optional)
});
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.API_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
});
exports.default = sessionMiddleware;
