"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isAuth(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                statusCode: 401,
                error: "Unauthorized: Missing Authorization Header",
            });
        }
        const match = authorization.match(/Bearer\s+(\S+)/);
        if (!match) {
            return res
                .status(401)
                .json({ statusCode: 401, error: "Unauthorized: Invalid Token Format" });
        }
        const token = match[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.API_KEY);
        req.auth = decoded;
        next();
        return; // Explicit return here
    }
    catch (error) {
        return res
            .status(401)
            .json({ statusCode: 401, error: "Unauthorized: Invalid Token" });
    }
}
