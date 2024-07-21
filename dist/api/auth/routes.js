"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const rateLimiter_1 = __importDefault(require("../../middlewares/rateLimiter"));
const sanitizeString_1 = __importDefault(require("../../middlewares/sanitizeString"));
const passport_1 = __importDefault(require("passport"));
const services_1 = __importDefault(require("../../middlewares/services"));
const router = (0, express_1.Router)();
router.post("/login", services_1.default, controller_1.login);
router.post("/register", rateLimiter_1.default, (0, sanitizeString_1.default)(["firstName", "lastName"]), services_1.default, controller_1.register);
router.get("/google", passport_1.default.authenticate("google-sso", {
    session: false,
    scope: ["profile", "email"],
}));
router.get("/google/callback/", passport_1.default.authenticate("google-sso", { session: false }), (req, res) => {
    return res.status(200).json(req.user).end();
});
exports.default = router;
