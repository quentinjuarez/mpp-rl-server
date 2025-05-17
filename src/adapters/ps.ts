import axios from "axios";
import qs from "qs";
import type { AxiosInstance } from "axios";

class PandaScoreAdapter {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.pandascore.co/rl",
      headers: {
        Authorization: `Bearer ${process.env.PANDASCORE_TOKEN}`,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "comma" });
      },
    });
  }

  // ?filter[id]=1,2,3
  async getMatches(ids: number[]) {
    const response = await this.client.get<PSMatch[]>("/matches", {
      params: {
        filter: {
          id: ids,
        },
      },
    });
    return response.data;
  }

  async getMatch(id: number) {
    const response = await this.client.get<PSMatch[]>("/matches", {
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
    const response = await this.client.get<PSMatch[]>("/matches/upcoming", {
      params: {
        filter: {
          serie_id,
        },
      },
    });
    return response.data;
  }

  async getPastMatches(serie_id: number) {
    const response = await this.client.get<PSMatch[]>("/matches/past", {
      params: {
        filter: {
          serie_id,
        },
      },
    });
    return response.data;
  }

  async getRunningSeries() {
    const response = await this.client.get<PSSerie[]>("/series/running");
    return response.data;
  }
}

export default PandaScoreAdapter;
