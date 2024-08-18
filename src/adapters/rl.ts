import axios from "axios";
import type { AxiosInstance } from "axios";

class RLAdapter {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://zsr.octane.gg",
    });
  }

  async getMatch(slug: string) {
    const response = await this.client.get(`/matches/${slug}`);
    return response.data;
  }
}

export default RLAdapter;
