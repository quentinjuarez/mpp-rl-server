"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRunning = getRunning;
async function getRunning(req, res, next) {
    try {
        // const { serie_id } = req.query;
        // if (!serie_id) {
        //   throw new Error("BAD_REQUEST");
        // }
        const series = await req.services.psAdapter().getRunningSeries();
        return res.status(200).json({ series }).end();
    }
    catch (err) {
        return next(err);
    }
}
