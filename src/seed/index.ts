// import { EventModel } from "../models/events";
const EventModel = {} as any;
import axios from "axios";
import { JSDOM } from "jsdom";
import { getTeams } from "./scrapping";

const event = {
  url: "/rocketleague/Rocket_League_Championship_Series/2024",
  name: "Rocket League Championship Series 2024 - World Championship",
  logo: "https://liquipedia.net/commons/images/thumb/5/57/RLCS_2024_World_Championship_darkmode.png/600px-RLCS_2024_World_Championship_darkmode.png",
  region: "Worldwide",
  series: {
    name: "Rocket League Championship Series",
    logo: "https://liquipedia.net/commons/images/thumb/c/c9/RLCS_2022_darkmode_icon.png/50px-RLCS_2022_darkmode_icon.png",
    url: "/rocketleague/Rocket_League_Championship_Series",
  },
  organizer: "Psyonix",
  type: "Offline",
  prize: {
    amount: 1165500,
    currency: "USD",
  },
  startDate: "2024-09-10",
  endDate: "2024-09-15",
  mode: 3,
  tier: "S-Tier",
  formats: [
    {
      name: "Swiss Stage",
      length: 5,
      startDate: "2024-09-10",
      endDate: "2024-09-13",
      stages: [
        {
          name: "Round 1 Matches",
          length: 8,
        },
        {
          name: "Round 2 High Matches",
          length: 4,
        },
        {
          name: "Round 2 Low Matches",
          length: 4,
        },
        {
          name: "Round 3 High Matches",
          length: 2,
        },
        {
          name: "Round 3 Mid Matches",
          length: 4,
        },
        {
          name: "Round 3 Low Matches",
          length: 2,
        },
        {
          name: "Round 4 High Matches",
          length: 3,
        },
        {
          name: "Round 4 Low Matches",
          length: 3,
        },
        {
          name: "Round 5 Matches",
          length: 3,
        },
      ],
    },
    {
      name: "Playoffs",
      length: 7,
      startDate: "2024-09-14",
      endDate: "2024-09-15",
      stages: [
        {
          name: "Lower Bracket Round 1",
          length: 4,
        },
        {
          name: "Lower Bracket Quarterfinals",
          length: 2,
        },
        {
          name: "Upper Bracket Quarterfinals",
          length: 4,
        },
        {
          name: "Semifinals",
          length: 2,
        },
        {
          name: "Grand Finals",
          length: 1,
        },
      ],
    },
  ],
};

const getDocument = async (url: string) => {
  const response = await axios.get(`https://liquipedia.net${url}`);

  const dom = new JSDOM(response.data);

  return dom.window.document;
};

export const init = async () => {
  try {
    await EventModel.deleteMany({});
    const oldEvent = await EventModel.findOne({ url: event.url });

    const document = await getDocument(event.url);

    const participants = getTeams(document);

    if (oldEvent) {
      await EventModel.findOneAndUpdate({ url: event.url }, { participants });

      return;
    }

    const createdEvent = new EventModel({
      ...event,
      participants,
    });
    await createdEvent.save();
  } catch (err) {
    console.error(err);
  }
};
