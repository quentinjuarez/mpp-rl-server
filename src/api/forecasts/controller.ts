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
    const { blue, orange, matchId, serieId, tournamentId, date } = req.body;

    if (
      blue === undefined ||
      orange === undefined ||
      !matchId ||
      !tournamentId ||
      !serieId ||
      !date
    ) {
      return res.status(400).json({ message: "BAD_REQUEST" }).end();
    }

    const service = req.services.forecastService();

    // const validation = await service.validateForecast({
    //   blue,
    //   orange,
    //   matchId,
    //   serieId,
    //   tournamentId,
    //   date,
    // });

    // if (!validation) throw new Error("FORBIDDEN");

    const forecast = await service.createOrUpdate({
      blue,
      orange,
      matchId,
      tournamentId,
      serieId,
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
    const { serieId } = req.query;

    const forecastService = req.services.forecastService();

    await forecastService.computeAllForecasts();

    const points = await forecastService.getMyPoints(
      serieId as string | undefined,
    );

    return res.status(200).json({ points }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getByMatchId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { matchId } = req.params;

    const forecasts = await req.services
      .forecastService()
      .getByMatchId(parseInt(matchId));

    const userIds = forecasts.map((f) => f.userId);

    const users = await req.services.userService().getByIds(userIds);

    const usersWithForecast = forecasts.map((f) => {
      const user = users.find((u) => String(u._id) === String(f.userId));

      return {
        ...f.toObject(),
        username: user?.username,
      };
    });

    return res
      .status(200)
      .json({
        forecasts: usersWithForecast,
      })
      .end();
  } catch (err) {
    return next(err);
  }
}
