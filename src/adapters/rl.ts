import axios from "axios";
import type { AxiosInstance } from "axios";

class RLAdapter {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://zsr.octane.gg",
    });
  }

  async getMatch(id: string) {
    const response = await this.client.get(`/matches/${id}`);
    return response.data;
  }
}

export default RLAdapter;
