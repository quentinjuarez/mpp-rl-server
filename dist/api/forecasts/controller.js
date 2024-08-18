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
        const { blue, orange, matchSlug, eventSlug, date } = req.body;
        if (blue === undefined ||
            orange === undefined ||
            !matchSlug ||
            !eventSlug ||
            !date) {
            return res.status(400).json({ message: "BAD_REQUEST" }).end();
        }
        const forecast = await req.services
            .forecastService()
            .createOrUpdate({ blue, orange, matchSlug, eventSlug, date });
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
        const { event } = req.query;
        const forecastService = req.services.forecastService();
        await forecastService.computeAllForecasts();
        const points = await forecastService.getMyPoints(event);
        return res.status(200).json({ points }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getForecastsResults(req, res, next) {
    try {
        const { event } = req.query;
        const forecasts = await req.services
            .forecastService()
            .getForecastsResults(event);
        return res.status(200).json({ forecasts }).end();
    }
    catch (err) {
        return next(err);
    }
}
