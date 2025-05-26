import { Request, Response, NextFunction } from "express";

export async function getRunning(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const series = await req.services.psAdapter().getRunningSeries();

    return res.status(200).json({ series }).end();
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
    const series = await req.services.psAdapter().getUpcomingSeries();

    return res.status(200).json({ series }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getPast(req: Request, res: Response, next: NextFunction) {
  try {
    const series = await req.services.psAdapter().getPastSeries();
    return res.status(200).json({ series }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, ids } = req.query;

    const series = await req.services.psAdapter().getAllSeries({
      ids: ids
        ? Array.isArray(ids)
          ? ids.map((id) => parseInt(String(id), 10))
          : [parseInt(ids as string, 10)]
        : undefined,
      year: year ? parseInt(year as string, 10) : undefined,
    });

    return res.status(200).json({ series }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("BAD_REQUEST");
    }

    const series = await req.services.psAdapter().getAllSeries({
      ids: [parseInt(id, 10)],
    });

    return res.status(200).json({ series }).end();
  } catch (err) {
    return next(err);
  }
}
