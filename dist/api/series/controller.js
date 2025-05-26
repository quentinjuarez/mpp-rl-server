"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRunning = getRunning;
exports.getUpcoming = getUpcoming;
exports.getPast = getPast;
exports.getAll = getAll;
exports.getById = getById;
async function getRunning(req, res, next) {
    try {
        const series = await req.services.psAdapter().getRunningSeries();
        return res.status(200).json({ series }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getUpcoming(req, res, next) {
    try {
        const series = await req.services.psAdapter().getUpcomingSeries();
        return res.status(200).json({ series }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getPast(req, res, next) {
    try {
        const series = await req.services.psAdapter().getPastSeries();
        return res.status(200).json({ series }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getAll(req, res, next) {
    try {
        const { year, ids } = req.query;
        const series = await req.services.psAdapter().getAllSeries({
            ids: ids
                ? Array.isArray(ids)
                    ? ids.map((id) => parseInt(String(id), 10))
                    : [parseInt(ids, 10)]
                : undefined,
            year: year ? parseInt(year, 10) : undefined,
        });
        return res.status(200).json({ series }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getById(req, res, next) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("BAD_REQUEST");
        }
        const series = await req.services.psAdapter().getAllSeries({
            ids: [parseInt(id, 10)],
        });
        return res.status(200).json({ series }).end();
    }
    catch (err) {
        return next(err);
    }
}
