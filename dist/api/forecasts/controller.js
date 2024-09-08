"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.createOrUpdate = createOrUpdate;
exports.getPoints = getPoints;
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
        const { blue, orange, matchId, serieId, tournamentId, date } = req.body;
        if (blue === undefined ||
            orange === undefined ||
            !matchId ||
            !tournamentId ||
            !serieId ||
            !date) {
            return res.status(400).json({ message: "BAD_REQUEST" }).end();
        }
        const service = req.services.forecastService();
        // const validation = await service.validateForecast({
        //   blue,
        //   orange,
        //   matchId,
        //   serieId,
        //   tournamentId,
        //   date,
        // });
        // if (!validation) throw new Error("FORBIDDEN");
        const forecast = await service.createOrUpdate({
            blue,
            orange,
            matchId,
            tournamentId,
            serieId,
            date,
        });
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
        const { serieId } = req.query;
        const forecastService = req.services.forecastService();
        await forecastService.computeAllForecasts();
        const points = await forecastService.getMyPoints(serieId);
        return res.status(200).json({ points }).end();
    }
    catch (err) {
        return next(err);
    }
}
