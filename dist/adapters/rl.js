"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class RLAdapter {
    client;
    constructor() {
        this.client = axios_1.default.create({
            // baseURL: "https://zsr.octane.gg",
            baseURL: "https://api.slokh.gg",
        });
    }
    // @ts-expect-error - Test
    async getMatch(slug) {
        return null;
        // const response = await this.client.get(`/matches/${slug}`);
        // return response.data;
    }
}
exports.default = RLAdapter;
