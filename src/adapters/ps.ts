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
    const response = await this.client.get("/", {
      params: {
        filter: {
          id: ids,
        },
      },
    });
    return response.data;
  }

  async getMatch(id: number) {
    const response = await this.client.get("/", {
      params: {
        filter: {
          id: [id],
        },
      },
    });
    return response.data?.[0];
  }

  // ?filter[serieId]=serie_id
  async getUpcomingMatches(serie_id: number) {
    const response = await this.client.get("/matches/upcoming", {
      params: {
        filter: {
          serie_id,
        },
      },
    });
    return response.data;
  }

  async getPastMatches(serie_id: number) {
    const response = await this.client.get("/matches/past", {
      params: {
        filter: {
          serie_id,
        },
      },
    });
    return response.data;
  }
}

export default PandaScoreAdapter;
