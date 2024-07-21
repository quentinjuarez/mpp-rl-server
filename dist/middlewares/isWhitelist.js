"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAuth;
const constant_1 = require("../config/constant");
function isAuth(req, _res, next) {
    try {
        const { origin } = req.headers;
        if (!origin || !constant_1.whitelist.includes(origin))
            throw new Error("UNAUTHORIZED");
        next();
    }
    catch (error) {
        next(error);
    }
}
