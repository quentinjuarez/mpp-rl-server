"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forecast = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ForecastSchema = new mongoose_1.Schema({
    blue: {
        type: Number,
        required: true,
    },
    orange: {
        type: Number,
        required: true,
    },
    matchId: {
        type: Number,
        required: true,
    },
    tournamentId: {
        type: Number,
        required: true,
    },
    serieId: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    processed: {
        type: Boolean,
        required: true,
        default: false,
    },
    correct: {
        type: Boolean,
        required: true,
        default: false,
    },
    exact: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { collection: "forecasts", timestamps: true });
ForecastSchema.index({ userId: 1, matchId: 1 }, { unique: true });
exports.Forecast = mongoose_1.default.model("Forecast", ForecastSchema);
