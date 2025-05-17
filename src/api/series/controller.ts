import { Request, Response, NextFunction } from "express";

export async function getRunning(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // const { serie_id } = req.query;

    // if (!serie_id) {
    //   throw new Error("BAD_REQUEST");
    // }

    const series = await req.services.psAdapter().getRunningSeries();

    return res.status(200).json({ series }).end();
  } catch (err) {
    return next(err);
  }
}
