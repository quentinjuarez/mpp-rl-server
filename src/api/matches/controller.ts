import { Request, Response, NextFunction } from "express";

export async function getPast(req: Request, res: Response, next: NextFunction) {
  try {
    const { tournamentId } = req.query;

    if (!tournamentId) {
      throw new Error("BAD_REQUEST");
    }

    const matches = await req.services
      .psAdapter()
      .getPastMatches(parseInt(tournamentId as string));

    return res.status(200).json({ matches }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getUpcoming(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { tournamentId } = req.query;

    if (!tournamentId) {
      throw new Error("BAD_REQUEST");
    }

    const matches = await req.services
      .psAdapter()
      .getUpcomingMatches(parseInt(tournamentId as string));

    return res.status(200).json({ matches }).end();
  } catch (err) {
    return next(err);
  }
}
