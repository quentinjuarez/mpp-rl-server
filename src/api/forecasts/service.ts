import type { Logger } from "pino";
import { Forecast } from "../../models/forecasts";
import type { ForecastDocument, ForecastDTO } from "../../models/forecasts";
import type PandaScoreAdapter from "../../adapters/ps";

export class ForecastService {
  private logger: Logger;
  private userId: string;
  private psAdapter: PandaScoreAdapter;

  constructor({
    logger,
    userId,
    psAdapter,
  }: {
    logger: Logger;
    userId: string;
    psAdapter: PandaScoreAdapter;
  }) {
    this.logger = logger;
    this.userId = userId;
    this.psAdapter = psAdapter;
  }

  async getAll(filter: { serieId?: number }): Promise<ForecastDocument[]> {
    try {
      const forecasts = await Forecast.find({ ...filter, userId: this.userId });

      return forecasts;
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }

  async getByUser(
    userId: string,
    enriched?: boolean,
  ): Promise<(ForecastDocument & { match?: PSMatch })[]> {
    try {
      const forecasts = await Forecast.find({
        userId,
      });

      if (enriched) {
        const matchIds = forecasts.map((f) => f.matchId);
        const matches = await this.psAdapter.getMatches({
          ids: matchIds,
        });

        const test = forecasts.map((forecast) => {
          const match = matches.find((m) => m.id === forecast.matchId);

          const forecastObj = forecast.toObject();

          const showScore =
            String(this.userId) === String(userId) ||
            new Date(forecastObj.date).getTime() < new Date().getTime();

          return {
            ...forecastObj,
            blue: showScore ? forecastObj.blue : -1,
            orange: showScore ? forecastObj.orange : -1,
            match,
          } as unknown as ForecastDocument & { match?: PSMatch };
        });
        return test;
      }

      return forecasts;
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }

  async validateForecast(payload: ForecastDTO) {
    const match = await this.psAdapter.getMatch(payload.matchId);

    if (!match) return false;

    const bestOf = match.number_of_games;
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

  async getPointsByUser(userId: string, serieId?: number): Promise<number> {
    try {
      const res = await Forecast.aggregate([
        {
          $match: {
            userId: String(userId),
            processed: true,
            ...(serieId ? { serieId } : {}),
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

  async getMyPoints(serieId?: number): Promise<number> {
    return this.getPointsByUser(this.userId, serieId);
  }

  async getPoints(serieId?: number): Promise<{ [userId: string]: number }> {
    try {
      const points = await Forecast.aggregate([
        {
          $match: {
            processed: true,
            ...(serieId ? { serieId } : {}),
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

  async computeAllForecasts(): Promise<boolean> {
    try {
      // Fetch all unprocessed forecasts grouped by matchId
      const forecasts = await Forecast.find({ processed: false });

      if (!forecasts.length) {
        return true;
      }

      const matchIds: number[] = [];

      // Group forecasts by matchId
      const forecastsByMatch = forecasts.reduce(
        (acc, forecast) => {
          if (!acc[forecast.matchId]) {
            matchIds.push(forecast.matchId);
            acc[forecast.matchId] = [];
          }
          acc[forecast.matchId].push(forecast);
          return acc;
        },
        {} as Record<number, ForecastDocument[]>,
      );

      const matches = await this.psAdapter.getMatches({
        ids: matchIds,
      });

      // Loop through each matchId group
      for (const matchId of Object.keys(forecastsByMatch)) {
        const match = matches.find((m) => m.id === parseInt(matchId));
        if (!match) {
          continue;
        }

        const hasWinner = !!match.winner_id;

        if (!hasWinner) {
          continue; // Skip this match if no winner is determined yet
        }

        const blueScore = match.results?.[0]?.score;
        const orangeScore = match.results?.[1]?.score;

        if (blueScore === undefined || orangeScore === undefined) {
          continue;
        }

        const blueWins = blueScore > orangeScore;

        // Process each forecast for the matchId
        const matchForecasts = forecastsByMatch[parseInt(matchId)];
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

  async getByMatchId(matchId: number): Promise<ForecastDocument[]> {
    try {
      const forecasts = await Forecast.find({ matchId });

      return forecasts;
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }
}

export default ForecastService;
