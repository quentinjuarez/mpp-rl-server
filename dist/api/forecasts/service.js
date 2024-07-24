"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastService = void 0;
const forecasts_1 = require("../../models/forecasts");
class ForecastService {
    logger;
    userId;
    rlAdapter;
    constructor({ logger, userId, rlAdapter, }) {
        this.logger = logger;
        this.userId = userId;
        this.rlAdapter = rlAdapter;
    }
    async getAll() {
        try {
            const forecasts = await forecasts_1.Forecast.find({ userId: this.userId });
            return forecasts;
        }
        catch (err) {
            this.logger.error(err);
            return [];
        }
    }
    async createOrUpdate(payload) {
        try {
            const existingForecast = await forecasts_1.Forecast.findOne({
                userId: this.userId,
                matchId: payload.matchId,
            });
            if (existingForecast) {
                const forecast = await forecasts_1.Forecast.findOneAndUpdate({ userId: this.userId, matchId: payload.matchId }, { ...payload }, { new: true });
                return forecast;
            }
            const forecast = await forecasts_1.Forecast.create({
                ...payload,
                userId: this.userId,
            });
            return forecast;
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
    async getPointsByUser(userId) {
        try {
            const res = await forecasts_1.Forecast.aggregate([
                { $match: { userId: String(userId), processed: true } },
                {
                    $group: {
                        _id: "$userId",
                        points: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$exact", true] }, // Check for exact first
                                    150, // 150 points if exact is true
                                    {
                                        $cond: [{ $eq: ["$correct", true] }, 100, 0],
                                    },
                                ],
                            },
                        },
                    },
                },
            ]);
            return res.length ? res[0].points : 0;
        }
        catch (err) {
            this.logger.error(err);
            return 0;
        }
    }
    async getMyPoints() {
        return this.getPointsByUser(this.userId);
    }
    async getPoints() {
        try {
            const points = await forecasts_1.Forecast.aggregate([
                { $match: { processed: true } },
                {
                    $group: {
                        _id: "$userId",
                        points: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$exact", true] }, // Check for exact first
                                    150, // 150 points if exact is true
                                    {
                                        $cond: [{ $eq: ["$correct", true] }, 100, 0],
                                    },
                                ],
                            },
                        },
                    },
                },
            ]);
            // Convert array of points to a map
            return points.reduce((acc, { _id, points }) => {
                acc[_id] = points;
                return acc;
            }, {});
        }
        catch (err) {
            this.logger.error(err);
            return {};
        }
    }
    async computeForecast() {
        try {
            const forecasts = await forecasts_1.Forecast.find({
                userId: this.userId,
                processed: false,
            });
            for (const forecast of forecasts) {
                const match = await this.rlAdapter.getMatch(forecast.matchId);
                const hasWinner = match.blue.winner || match.orange.winner;
                if (!hasWinner) {
                    continue;
                }
                const blueScore = match.blue.score;
                const orangeScore = match.orange.score;
                const blueWins = blueScore > orangeScore;
                const forecastBlueWins = forecast.blue > forecast.orange;
                const correct = blueWins === forecastBlueWins;
                const exact = blueScore === forecast.blue && orangeScore === forecast.orange;
                await forecasts_1.Forecast.updateOne({ _id: forecast._id }, { $set: { correct, exact, processed: true } });
            }
            return true;
        }
        catch (err) {
            this.logger.error(err);
            return false;
        }
    }
    async getForecastsResults() {
        try {
            const res = await forecasts_1.Forecast.aggregate([
                {
                    $match: {
                        userId: this.userId,
                    },
                },
                {
                    $group: {
                        _id: "$matchId",
                        forecasts: {
                            $push: "$$ROOT",
                        },
                    },
                },
            ]);
            return res.reduce((acc, { _id, forecasts }) => {
                acc[_id] = forecasts[0];
                return acc;
            }, {});
        }
        catch (error) {
            this.logger.error(error);
            return {};
        }
    }
}
exports.ForecastService = ForecastService;
exports.default = ForecastService;
