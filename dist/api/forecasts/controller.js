"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.createOrUpdate = createOrUpdate;
exports.getPoints = getPoints;
exports.getForecastsResults = getForecastsResults;
async function getAll(req, res, next) {
    try {
        const forecasts = await req.services.forecastService().getAll();
        return res.status(200).json({ forecasts }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function createOrUpdate(req, res, next) {
    try {
        const { blue, orange, matchId, eventId, date } = req.body;
        if (blue === undefined ||
            orange === undefined ||
            !matchId ||
            !eventId ||
            !date) {
            return res.status(400).json({ message: "BAD_REQUEST" }).end();
        }
        const forecast = await req.services
            .forecastService()
            .createOrUpdate({ blue, orange, matchId, eventId, date });
        if (!forecast)
            throw new Error("NOT_FOUND");
        return res.status(200).json(forecast.toObject()).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getPoints(req, res, next) {
    try {
        const forecastService = req.services.forecastService();
        await forecastService.computeForecast();
        const points = await forecastService.getMyPoints();
        return res.status(200).json({ points }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getForecastsResults(req, res, next) {
    try {
        const forecasts = await req.services
            .forecastService()
            .getForecastsResults();
        return res.status(200).json({ forecasts }).end();
    }
    catch (err) {
        return next(err);
    }
}
