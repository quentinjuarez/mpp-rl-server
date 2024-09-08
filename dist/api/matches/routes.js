"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const isAuth_1 = __importDefault(require("../../middlewares/isAuth"));
const services_1 = __importDefault(require("../../middlewares/services"));
const router = (0, express_1.Router)();
router.get("/past", isAuth_1.default, services_1.default, controller_1.getPast);
router.get("/upcoming", isAuth_1.default, services_1.default, controller_1.getUpcoming);
exports.default = router;
