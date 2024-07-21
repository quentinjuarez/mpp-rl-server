"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastService = void 0;
const forecasts_1 = require("../../models/forecasts");
class ForecastService {
    logger;
    userId;
    constructor({ logger, userId }) {
        this.logger = logger;
        this.userId = userId;
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
            const forecasts = await forecasts_1.Forecast.find({
                userId,
                processed: true,
            });
            return forecasts.reduce((acc, forecast) => {
                if (forecast.correct) {
                    return acc + 100;
                }
                if (forecast.exact) {
                    return acc + 50;
                }
                return acc;
            }, 0);
        }
        catch (err) {
            this.logger.error(err);
            return 0;
        }
    }
    async getPoints() {
        return this.getPointsByUser(this.userId);
    }
    async getPointsByUsers(userIds) {
        try {
            const points = await forecasts_1.Forecast.aggregate([
                { $match: { userId: { $in: userIds }, processed: true } },
                {
                    $group: {
                        _id: "$userId",
                        points: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$correct", true] },
                                    100,
                                    { $cond: [{ $eq: ["$exact", true] }, 50, 0] },
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
}
exports.ForecastService = ForecastService;
exports.default = ForecastService;
