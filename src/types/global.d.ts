import type { Env } from "../config/env";
import type ServicesFactory from "../factories/services";
import type { SourceType } from "../models/users";

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }

  interface UserAuth {
    userId: string;
    source: SourceType;
  }

  namespace Express {
    interface Request {
      auth: UserAuth;
      services: ServicesFactory;
      ipAddress: string;
    }
  }

  // RL
  interface PSMatch {
    match_type: string;
    serie_id: number;
    winner_id: null;
    status: string;
    begin_at: string;
    rescheduled: boolean;
    slug: string;
    id: number;
    serie: PSMatchSerie;
    name: string;
    detailed_stats: boolean;
    modified_at: string;
    game_advantage: null;
    number_of_games: number;
    tournament: PSMatchTournament;
    forfeit: boolean;
    end_at: null;
    draw: boolean;
    results: PSResult[];
    games: PSGame[];
    opponents: PSOpponents[];
    scheduled_at: string;
    league_id: number;
    winner: null;
    original_scheduled_at: string;
    winner_type: string;
    tournament_id: number;
  }

  interface PSGame {
    begin_at: null;
    complete: boolean;
    detailed_stats: boolean;
    end_at: null;
    finished: boolean;
    forfeit: boolean;
    id: number;
    length: null;
    match_id: number;
    position: number;
    status: string;
    winner: PSWinner;
    winner_type: string;
  }

  interface PSWinner {
    id: null;
    type: string;
  }

  interface PSOpponents {
    opponent: PSTeam;
    type: string;
  }

  interface PSTeam {
    acronym: string;
    id: number;
    image_url: string;
    location: string;
    modified_at: string;
    name: string;
    slug: string;
  }

  interface PSResult {
    score: number;
    team_id: number;
  }

  interface PSMatchSerie {
    begin_at: string;
    end_at: string;
    full_name: string;
    id: number;
    league_id: number;
    modified_at: string;
    name: string;
    season: null;
    slug: string;
    winner_id: null;
    winner_type: string;
    year: number;
  }

  interface PSMatchTournament {
    begin_at: string;
    detailed_stats: boolean;
    end_at: string;
    has_bracket: boolean;
    id: number;
    league_id: number;
    live_supported: boolean;
    modified_at: string;
    name: string;
    prizepool: null;
    serie_id: number;
    slug: string;
    tier: string;
    winner_id: null;
    winner_type: string;
  }
}
