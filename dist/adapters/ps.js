"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
class PandaScoreAdapter {
    client;
    constructor() {
        this.client = axios_1.default.create({
            baseURL: "https://api.pandascore.co/rl",
            headers: {
                Authorization: `Bearer ${process.env.PANDASCORE_TOKEN}`,
            },
            paramsSerializer: (params) => {
                return qs_1.default.stringify(params, { arrayFormat: "comma" });
            },
        });
    }
    // ?filter[id]=1,2,3
    async getMatches(ids) {
        const response = await this.client.get("/matches", {
            params: {
                filter: {
                    id: ids,
                },
            },
        });
        return response.data;
    }
    async getMatch(id) {
        const response = await this.client.get("/matches", {
            params: {
                filter: {
                    id: [id],
                },
            },
        });
        return response.data?.[0];
    }
    // ?filter[serieId]=serie_id
    async getUpcomingMatches(serie_id) {
        const response = await this.client.get("/matches/upcoming", {
            params: {
                filter: {
                    serie_id,
                },
            },
        });
        return response.data;
    }
    async getPastMatches(serie_id) {
        const response = await this.client.get("/matches/past", {
            params: {
                filter: {
                    serie_id,
                },
            },
        });
        return response.data;
    }
}
exports.default = PandaScoreAdapter;
