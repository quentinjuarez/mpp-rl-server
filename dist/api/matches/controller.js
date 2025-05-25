"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = get;
exports.getAll = getAll;
exports.getPast = getPast;
exports.getUpcoming = getUpcoming;
exports.getRunning = getRunning;
async function get(req, res, next) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("BAD_REQUEST");
        }
        const match = await req.services
            .psAdapter()
            .getMatch(parseInt(id));
        if (!match) {
            throw new Error("NOT_FOUND");
        }
        return res.status(200).json({ match }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getAll(req, res, next) {
    try {
        const { serie_id } = req.query;
        if (!serie_id) {
            throw new Error("BAD_REQUEST");
        }
        const matches = await req.services
            .psAdapter()
            .getMatches({ serie_id: parseInt(serie_id) });
        return res.status(200).json({ matches }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getPast(req, res, next) {
    try {
        const { serie_id } = req.query;
        if (!serie_id) {
            throw new Error("BAD_REQUEST");
        }
        const matches = await req.services
            .psAdapter()
            .getPastMatches(parseInt(serie_id));
        return res.status(200).json({ matches }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getUpcoming(req, res, next) {
    try {
        const { serie_id } = req.query;
        if (!serie_id) {
            throw new Error("BAD_REQUEST");
        }
        const matches = await req.services
            .psAdapter()
            .getUpcomingMatches(parseInt(serie_id));
        return res.status(200).json({ matches }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getRunning(req, res, next) {
    try {
        const { serie_id } = req.query;
        if (!serie_id) {
            throw new Error("BAD_REQUEST");
        }
        const matches = await req.services
            .psAdapter()
            .getRunningMatches(parseInt(serie_id));
        return res.status(200).json({ matches }).end();
    }
    catch (err) {
        return next(err);
    }
}
