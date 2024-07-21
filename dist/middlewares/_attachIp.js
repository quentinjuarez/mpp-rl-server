"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = attachIp;
function attachIp(req, _res, next) {
    req.ipAddress = req.headers["x-forwarded-for"];
    next();
}
