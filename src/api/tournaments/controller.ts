import { Request, Response, NextFunction } from "express";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { serie_id } = req.query;

    const tournaments = await req.services
      .psAdapter()
      .getAllTournaments(serie_id ? { serieId: Number(serie_id) } : {});

    return res.status(200).json({ tournaments }).end();
  } catch (err) {
    return next(err);
  }
}
