"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const decryptPassword = async (candidatePassword, password) => {
    return await bcrypt_1.default.compare(candidatePassword, password);
};
exports.default = decryptPassword;
