import axios from "axios";
import type { AxiosInstance } from "axios";

class PandaScoreAdapter {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.pandascore.co/rl",
      headers: {
        Authorization: `Bearer ${process.env.PANDASCORE_TOKEN}`,
      },
    });
  }

  async getMatches(ids: number[]) {
    const response = await this.client.get("/matches", {
      params: {
        id: ids,
      },
    });
    return response.data;
  }

  async getUpcomingMatches(tournamentId: number) {
    const response = await this.client.get("/matches/upcoming", {
      params: {
        tournament_id: tournamentId,
      },
    });
    return response.data;
  }

  async getPastMatches(tournamentId: number) {
    const response = await this.client.get("/matches/past", {
      params: {
        tournament_id: tournamentId,
      },
    });
    return response.data;
  }
}

export default PandaScoreAdapter;
