import { Request, Response, NextFunction } from "express";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const forecasts = await req.services.forecastService().getAll();

    return res.status(200).json({ forecasts }).end();
  } catch (err) {
    return next(err);
  }
}

export async function createOrUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { blue, orange, matchId, tournamentId, date } = req.body;

    if (
      blue === undefined ||
      orange === undefined ||
      !matchId ||
      !tournamentId ||
      !date
    ) {
      return res.status(400).json({ message: "BAD_REQUEST" }).end();
    }

    const service = req.services.forecastService();

    const validation = await service.validateForecast({
      blue,
      orange,
      matchId,
      tournamentId,
      date,
    });

    if (!validation) throw new Error("FORBIDDEN");

    const forecast = await service.createOrUpdate({
      blue,
      orange,
      matchId,
      tournamentId,
      date,
    });

    if (!forecast) throw new Error("NOT_FOUND");

    return res.status(200).json(forecast.toObject()).end();
  } catch (err) {
    return next(err);
  }
}

export async function getPoints(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { event } = req.query;

    const forecastService = req.services.forecastService();

    await forecastService.computeAllForecasts();

    const points = await forecastService.getMyPoints(
      event as string | undefined,
    );

    return res.status(200).json({ points }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getForecastsResults(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { event } = req.query;

    const forecasts = await req.services
      .forecastService()
      .getForecastsResults(event as string | undefined);

    return res.status(200).json({ forecasts }).end();
  } catch (err) {
    return next(err);
  }
}
