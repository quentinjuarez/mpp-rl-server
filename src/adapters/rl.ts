import axios from "axios";
import type { AxiosInstance } from "axios";

class RLAdapter {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      // baseURL: "https://zsr.octane.gg",
      baseURL: "https://api.slokh.gg",
    });
  }

  // @ts-expect-error - Test
  async getMatch(slug: any) {
    return null as unknown as any;
    // const response = await this.client.get(`/matches/${slug}`);
    // return response.data;
  }
}

export default RLAdapter;
