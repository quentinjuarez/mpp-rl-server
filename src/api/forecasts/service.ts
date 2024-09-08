import type { Logger } from "pino";
import { Forecast } from "../../models/forecasts";
import type { ForecastDocument, ForecastDTO } from "../../models/forecasts";
import RLAdapter from "../../adapters/rl";

export class ForecastService {
  private logger: Logger;
  private userId: string;
  private rlAdapter: RLAdapter;

  constructor({
    logger,
    userId,
    rlAdapter,
  }: {
    logger: Logger;
    userId: string;
    rlAdapter: RLAdapter;
  }) {
    this.logger = logger;
    this.userId = userId;
    this.rlAdapter = rlAdapter;
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

  async validateForecast(payload: ForecastDTO) {
    const match = await this.rlAdapter.getMatch(payload.matchId);

    if (!match) return false;

    const bestOf = match.format.length;
    const maxScore = (bestOf % 2) + Math.floor(bestOf / 2);

    if (payload.blue < 0 || payload.orange < 0) {
      return false;
    }

    if (payload.blue > maxScore || payload.orange > maxScore) {
      return false;
    }

    if (payload.blue === payload.orange) {
      return false;
    }

    if (payload.blue !== maxScore && payload.orange !== maxScore) {
      return false;
    }

    return true;
  }

  async createOrUpdate(payload: ForecastDTO): Promise<ForecastDocument | null> {
    try {
      await this.validateForecast(payload);

      const existingForecast = await Forecast.findOne({
        userId: this.userId,
        matchId: payload.matchId,
      });

      if (existingForecast) {
        if (existingForecast.processed) {
          return null;
        }

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

  async getPointsByUser(
    userId: string,
    tournamentId?: string,
  ): Promise<number> {
    try {
      const res = await Forecast.aggregate([
        {
          $match: {
            userId: String(userId),
            processed: true,
            ...(tournamentId ? { tournamentId } : {}),
          },
        },
        {
          $group: {
            _id: "$userId",
            points: {
              $sum: {
                $cond: [
                  { $eq: ["$exact", true] }, // Check for exact first
                  150, // 150 points if exact is true
                  {
                    $cond: [{ $eq: ["$correct", true] }, 100, 0],
                  },
                ],
              },
            },
          },
        },
      ]);

      return res.length ? res[0].points : 0;
    } catch (err) {
      this.logger.error(err);
      return 0;
    }
  }

  async getMyPoints(tournamentId?: string): Promise<number> {
    return this.getPointsByUser(this.userId, tournamentId);
  }

  async getPoints(
    tournamentId?: string,
  ): Promise<{ [userId: string]: number }> {
    try {
      const points = await Forecast.aggregate([
        {
          $match: {
            processed: true,
            ...(tournamentId ? { tournamentId } : {}),
          },
        },
        {
          $group: {
            _id: "$userId",
            points: {
              $sum: {
                $cond: [
                  { $eq: ["$exact", true] }, // Check for exact first
                  150, // 150 points if exact is true
                  {
                    $cond: [{ $eq: ["$correct", true] }, 100, 0],
                  },
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

  async computeMyForecasts(): Promise<boolean> {
    try {
      const forecasts = await Forecast.find({
        userId: this.userId,
        processed: false,
      });

      for (const forecast of forecasts) {
        const match = await this.rlAdapter.getMatch(forecast.matchId);

        const hasWinner = match.blue.winner || match.orange.winner;

        if (!hasWinner) {
          continue;
        }

        const blueScore = match.blue.score;
        const orangeScore = match.orange.score;

        const blueWins = blueScore > orangeScore;
        const forecastBlueWins = forecast.blue > forecast.orange;

        const correct = blueWins === forecastBlueWins;
        const exact =
          blueScore === forecast.blue && orangeScore === forecast.orange;

        await Forecast.updateOne(
          { _id: forecast._id },
          { $set: { correct, exact, processed: true } },
        );
      }

      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async computeAllForecasts(): Promise<boolean> {
    try {
      // Fetch all unprocessed forecasts grouped by matchId
      const forecasts = await Forecast.find({ processed: false });

      // Group forecasts by matchId
      const forecastsByMatch = forecasts.reduce(
        (acc, forecast) => {
          if (!acc[forecast.matchId]) {
            acc[forecast.matchId] = [];
          }
          acc[forecast.matchId].push(forecast);
          return acc;
        },
        {} as Record<string, ForecastDocument[]>,
      );

      // Loop through each matchId group
      for (const matchId of Object.keys(forecastsByMatch)) {
        const match = await this.rlAdapter.getMatch(matchId);
        const hasWinner = match.blue.winner || match.orange.winner;

        if (!hasWinner) {
          continue; // Skip this match if no winner is determined yet
        }

        const blueScore = match.blue.score;
        const orangeScore = match.orange.score;
        const blueWins = blueScore > orangeScore;

        // Process each forecast for the matchId
        const matchForecasts = forecastsByMatch[matchId];
        for (const forecast of matchForecasts) {
          const forecastBlueWins = forecast.blue > forecast.orange;
          const correct = blueWins === forecastBlueWins;
          const exact =
            blueScore === forecast.blue && orangeScore === forecast.orange;

          // Update the forecast with the result
          await Forecast.updateOne(
            { _id: forecast._id },
            { $set: { correct, exact, processed: true } },
          );
        }
      }

      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async getForecastsResults(
    tournamentId?: string,
  ): Promise<Record<string, ForecastDocument>> {
    try {
      const res = await Forecast.aggregate([
        {
          $match: {
            userId: this.userId,
            ...(tournamentId ? { tournamentId } : {}),
          },
        },
        {
          $group: {
            _id: "$matchId",
            forecasts: {
              $push: "$$ROOT",
            },
          },
        },
      ]);

      return res.reduce((acc, { _id, forecasts }) => {
        acc[_id] = forecasts[0];
        return acc;
      }, {});
    } catch (error) {
      this.logger.error(error);
      return {};
    }
  }
}

export default ForecastService;
