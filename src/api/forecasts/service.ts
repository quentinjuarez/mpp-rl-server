import type { Logger } from "pino";
import { Forecast } from "../../models/forecasts";
import type { ForecastDocument, ForecastDTO } from "../../models/forecasts";

export class ForecastService {
  private logger: Logger;
  private userId: string;

  constructor({ logger, userId }: { logger: Logger; userId: string }) {
    this.logger = logger;
    this.userId = userId;
  }

  async getAll(): Promise<ForecastDocument[]> {
    try {
      const forecasts = await Forecast.find({ userId: this.userId });

      return forecasts;
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }

  async createOrUpdate(payload: ForecastDTO): Promise<ForecastDocument | null> {
    try {
      const existingForecast = await Forecast.findOne({
        userId: this.userId,
        matchId: payload.matchId,
      });

      if (existingForecast) {
        const forecast = await Forecast.findOneAndUpdate(
          { userId: this.userId, matchId: payload.matchId },
          { ...payload },
          { new: true },
        );

        return forecast;
      }

      const forecast = await Forecast.create({
        ...payload,
        userId: this.userId,
      });

      return forecast;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async getPointsByUser(userId: string): Promise<number> {
    try {
      const forecasts = await Forecast.find({
        userId,
        processed: true,
      });

      return forecasts.reduce((acc, forecast) => {
        if (forecast.correct) {
          return acc + 100;
        }

        if (forecast.exact) {
          return acc + 50;
        }

        return acc;
      }, 0);
    } catch (err) {
      this.logger.error(err);
      return 0;
    }
  }

  async getPoints(): Promise<number> {
    return this.getPointsByUser(this.userId);
  }

  async getPointsByUsers(
    userIds: string[],
  ): Promise<{ [key: string]: number }> {
    try {
      const points = await Forecast.aggregate([
        { $match: { userId: { $in: userIds }, processed: true } },
        {
          $group: {
            _id: "$userId",
            points: {
              $sum: {
                $cond: [
                  { $eq: ["$correct", true] },
                  100,
                  { $cond: [{ $eq: ["$exact", true] }, 50, 0] },
                ],
              },
            },
          },
        },
      ]);

      // Convert array of points to a map
      return points.reduce((acc, { _id, points }) => {
        acc[_id] = points;
        return acc;
      }, {});
    } catch (err) {
      this.logger.error(err);
      return {};
    }
  }
}

export default ForecastService;
