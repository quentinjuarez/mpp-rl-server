"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const isAuth_1 = __importDefault(require("../../middlewares/isAuth"));
const sanitizeString_1 = __importDefault(require("../../middlewares/sanitizeString"));
const services_1 = __importDefault(require("../../middlewares/services"));
const rateLimiter_1 = __importDefault(require("../../middlewares/rateLimiter"));
const router = (0, express_1.Router)();
router.get("/me", isAuth_1.default, services_1.default, controller_1.getMe);
router.post("/me", isAuth_1.default, (0, sanitizeString_1.default)(["username"]), services_1.default, controller_1.updateMe);
router.post("/me/password", rateLimiter_1.default, isAuth_1.default, services_1.default, controller_1.updatePassword);
router.post("/username/check", isAuth_1.default, services_1.default, controller_1.checkUsername);
router.get("/leaderboard", isAuth_1.default, services_1.default, controller_1.getLeaderboard);
router.get("/:username", isAuth_1.default, services_1.default, controller_1.getUser);
exports.default = router;
