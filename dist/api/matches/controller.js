"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPast = getPast;
exports.getUpcoming = getUpcoming;
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
