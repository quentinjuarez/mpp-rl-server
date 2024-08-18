"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const isAuth_1 = __importDefault(require("../../middlewares/isAuth"));
const router = (0, express_1.Router)();
router.get("/", isAuth_1.default, async (req, res) => {
    const url = req.query.url;
    try {
        if (!url) {
            return res.status(400).json({ error: "Missing URL query parameter" });
        }
        let params = {};
        try {
            params = JSON.parse(req.query.params || "{}");
        }
        catch (err) {
            return res.status(400).json({ error: "Invalid params query parameter" });
        }
        console.log(params);
        const response = await axios_1.default.get(url, Object.keys(params).length > 0 ? { params } : {});
        const fullPathDebug = `${response.request.protocol}//${response.request.host}${response.request.path}`;
        console.log({ fullPathDebug });
        return res.send(response.data);
    }
    catch (err) {
        return res.status(500).send("Error fetching URL");
    }
});
exports.default = router;
