"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.whitelist = void 0;
exports.whitelist = [process.env.FRONT_URL, process.env.BACK_URL];
exports.corsOptions = [process.env.FRONT_URL];
