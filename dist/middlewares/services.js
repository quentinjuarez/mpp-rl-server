"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = attachServices;
const services_1 = __importDefault(require("../factories/services"));
function attachServices(req, res, next) {
    try {
        req.services = services_1.default.init(req);
        next();
        return;
    }
    catch (error) {
        return res.status(500);
    }
}
