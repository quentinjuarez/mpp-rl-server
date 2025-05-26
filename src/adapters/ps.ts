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
  async getMatches(
    filter: {
      ids?: number[];
      serie_id?: number;
    } = {},
  ) {
    const parsedFilter: Record<string, unknown> = {};
    if (filter.ids) {
      parsedFilter.id = filter.ids;
    }
    if (filter.serie_id) {
      parsedFilter.serie_id = filter.serie_id;
    }

    const response = await this.client.get<PSMatch[]>("/matches", {
      params: {
        filter: parsedFilter,
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

  async getRunningMatches(serie_id: number) {
    const response = await this.client.get<PSMatch[]>("/matches/running", {
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

  async getUpcomingSeries() {
    const response = await this.client.get<PSSerie[]>("/series/upcoming");
    return response.data;
  }

  async getPastSeries() {
    const response = await this.client.get<PSSerie[]>("/series/past");
    return response.data;
  }

  async getAllSeries(filter: { year?: number; ids?: number[] } = {}) {
    const parsedFilter: Record<string, unknown> = {};
    if (filter.year) {
      parsedFilter.year = filter.year;
    }
    if (filter.ids) {
      parsedFilter.id = filter.ids;
    }

    const response = await this.client.get<PSSerie[]>("/series", {
      params: {
        filter: parsedFilter,
      },
    });
    return response.data;
  }
}

export default PandaScoreAdapter;
