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
            baseURL: "https://zsr.octane.gg",
        });
    }
    async getMatch(id) {
        const response = await this.client.get(`/matches/${id}`);
        return response.data;
    }
}
exports.default = RLAdapter;
