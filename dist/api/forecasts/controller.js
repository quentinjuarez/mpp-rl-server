"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.createOrUpdate = createOrUpdate;
exports.getPoints = getPoints;
exports.getByMatchId = getByMatchId;
async function getAll(req, res, next) {
    try {
        const { serie_id } = req.query;
        const forecasts = await req.services
            .forecastService()
            .getAll(serie_id ? { serieId: Number(serie_id) } : {});
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
        const { serie_id, enriched } = req.query;
        const isEnriched = enriched === "true";
        const forecastService = req.services.forecastService();
        await forecastService.computeAllForecasts();
        const points = await forecastService.getMyPoints(serie_id ? Number(serie_id) : undefined);
        if (isEnriched) {
            const forecasts = await req.services
                .forecastService()
                .getAll(serie_id ? { serieId: Number(serie_id) } : {});
            return res.status(200).json({ points, forecasts }).end();
        }
        return res.status(200).json({ points }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getByMatchId(req, res, next) {
    try {
        const { matchId } = req.params;
        const forecasts = await req.services
            .forecastService()
            .getByMatchId(parseInt(matchId));
        const userIds = forecasts.map((f) => f.userId);
        const users = await req.services.userService().getByIds(userIds);
        const usersWithForecast = forecasts.map((f) => {
            const user = users.find((u) => String(u._id) === String(f.userId));
            const forecastObj = f.toObject();
            const showScore = req.auth.userId === f.userId || forecastObj.date < new Date();
            return {
                ...f.toObject(),
                blue: showScore ? forecastObj.blue : "-",
                orange: showScore ? forecastObj.orange : "-",
                username: user?.username,
            };
        });
        return res
            .status(200)
            .json({
            forecasts: usersWithForecast,
        })
            .end();
    }
    catch (err) {
        return next(err);
    }
}
