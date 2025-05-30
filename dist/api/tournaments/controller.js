"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
async function getAll(req, res, next) {
    try {
        const { serie_id } = req.query;
        const tournaments = await req.services
            .psAdapter()
            .getAllTournaments(serie_id ? { serieId: Number(serie_id) } : {});
        return res.status(200).json({ tournaments }).end();
    }
    catch (err) {
        return next(err);
    }
}
