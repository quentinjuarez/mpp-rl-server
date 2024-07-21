"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
const MAX_LENGTH = 128;
const purifyString = (dirtyString, disableLimit) => {
    const text = isomorphic_dompurify_1.default.sanitize(dirtyString, { ALLOWED_TAGS: [] }).trim();
    if (disableLimit)
        return text;
    if (text.length > MAX_LENGTH) {
        return text.slice(0, MAX_LENGTH);
    }
    return text;
};
const sanitizeString = (keys, disableLimit = false) => (req, _res, next) => {
    const { body } = req;
    keys.forEach((key) => {
        if (body[key]) {
            const newValue = purifyString(body[key], disableLimit);
            if (newValue !== body[key]) {
                body[key] = newValue;
                req.body[`${key}Sanitized`] = true;
            }
        }
    });
    next();
};
exports.default = sanitizeString;
