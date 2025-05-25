import { Request, Response, NextFunction } from "express";

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("BAD_REQUEST");
    }

    const match = await req.services
      .psAdapter()
      .getMatch(parseInt(id as string));

    if (!match) {
      throw new Error("NOT_FOUND");
    }

    return res.status(200).json({ match }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { serie_id } = req.query;

    if (!serie_id) {
      throw new Error("BAD_REQUEST");
    }

    const matches = await req.services
      .psAdapter()
      .getMatches({ serie_id: parseInt(serie_id as string) });

    return res.status(200).json({ matches }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getPast(req: Request, res: Response, next: NextFunction) {
  try {
    const { serie_id } = req.query;

    if (!serie_id) {
      throw new Error("BAD_REQUEST");
    }

    const matches = await req.services
      .psAdapter()
      .getPastMatches(parseInt(serie_id as string));

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
    const { serie_id } = req.query;

    if (!serie_id) {
      throw new Error("BAD_REQUEST");
    }

    const matches = await req.services
      .psAdapter()
      .getUpcomingMatches(parseInt(serie_id as string));

    return res.status(200).json({ matches }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getRunning(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { serie_id } = req.query;

    if (!serie_id) {
      throw new Error("BAD_REQUEST");
    }

    const matches = await req.services
      .psAdapter()
      .getRunningMatches(parseInt(serie_id as string));

    return res.status(200).json({ matches }).end();
  } catch (err) {
    return next(err);
  }
}
